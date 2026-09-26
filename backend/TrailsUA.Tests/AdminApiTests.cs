using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Npgsql;
using TrailsUA.Domain.DTOs.Booking;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Tests;

public class AdminApiTests
{
    [PostgresFact]
    public async Task AdminLifecycleEnforcesPermissionsAndRevokesSessions()
    {
        var adminConnection = Environment.GetEnvironmentVariable("TEST_POSTGRES_CONNECTION")!;
        var databaseName = "trailsua_admin_test_" + Guid.NewGuid().ToString("N");
        await using var admin = new NpgsqlConnection(adminConnection);
        await admin.OpenAsync();
        await using (var command = new NpgsqlCommand($"CREATE DATABASE {databaseName}", admin)) await command.ExecuteNonQueryAsync();
        var connection = new NpgsqlConnectionStringBuilder(adminConnection) { Database = databaseName, Pooling = false }.ConnectionString;
        try
        {
            await using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Development");
                builder.UseSetting("JwtSettings:SecretKey", "test-only-booking-signing-key-at-least-64-characters-long-1234567890");
                builder.UseSetting("BootstrapAdmin:Email", "root@example.test");
                builder.UseSetting("BootstrapAdmin:Password", "root-test-password");
                builder.ConfigureServices(services =>
                {
                    services.RemoveAll<DbContextOptions<AppDbContext>>();
                    services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connection));
                });
            });
            using var anonymous = factory.CreateClient();
            using var root = factory.CreateClient();
            using var member = factory.CreateClient();
            using var delegateAdmin = factory.CreateClient();
            async Task<JsonElement> Authenticate(HttpClient client, string email, string password, bool register = false)
            {
                var response = await client.PostAsJsonAsync(register ? "/api/auth/register" : "/api/auth/login",
                    new { email, password, firstName = "Test", lastName = "Account", role = 0 });
                response.EnsureSuccessStatusCode();
                var body = await response.Content.ReadFromJsonAsync<JsonElement>();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", body.GetProperty("accessToken").GetString());
                return body;
            }
            var rootAuth = await Authenticate(root, "root@example.test", "root-test-password");
            var rootId = rootAuth.GetProperty("user").GetProperty("id").GetGuid();
            var memberAuth = await Authenticate(member, "member@example.test", "member-password", true);
            var memberId = memberAuth.GetProperty("user").GetProperty("id").GetGuid();
            var delegateAuth = await Authenticate(delegateAdmin, "delegate@example.test", "delegate-password", true);
            var delegateId = delegateAuth.GetProperty("user").GetProperty("id").GetGuid();
            Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/admin/users")).StatusCode);
            Assert.Equal(HttpStatusCode.Forbidden, (await member.GetAsync("/api/admin/statistics")).StatusCode);
            Assert.Equal(HttpStatusCode.BadRequest, (await root.PutAsJsonAsync($"/api/admin/users/{memberId}/role", 99)).StatusCode);
            Assert.Equal(HttpStatusCode.Conflict, (await root.DeleteAsync($"/api/admin/users/{rootId}")).StatusCode);
            Assert.Equal(HttpStatusCode.Conflict, (await root.PutAsJsonAsync($"/api/admin/users/{rootId}/blocked", true)).StatusCode);
            (await root.PutAsJsonAsync($"/api/admin/users/{delegateId}/role", 3)).EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Unauthorized, (await delegateAdmin.GetAsync("/api/user/me")).StatusCode);
            await Authenticate(delegateAdmin, "delegate@example.test", "delegate-password");
            Assert.Equal(HttpStatusCode.Forbidden, (await delegateAdmin.PutAsJsonAsync($"/api/admin/users/{memberId}/role", 3)).StatusCode);
            Assert.Equal(HttpStatusCode.Conflict, (await delegateAdmin.DeleteAsync($"/api/admin/users/{rootId}")).StatusCode);
            (await delegateAdmin.PutAsJsonAsync($"/api/admin/users/{memberId}/blocked", true)).EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Unauthorized, (await member.GetAsync("/api/user/me")).StatusCode);
            Assert.False((await anonymous.PostAsJsonAsync("/api/auth/login", new { email = "member@example.test", password = "member-password" })).IsSuccessStatusCode);
            Assert.False((await anonymous.PostAsJsonAsync("/api/auth/refresh", new { refreshToken = memberAuth.GetProperty("refreshToken").GetString() })).IsSuccessStatusCode);
            var search = await root.GetFromJsonAsync<JsonElement>("/api/admin/users?search=MEMBER&status=blocked&pageSize=1");
            Assert.Equal(1, search.GetProperty("total").GetInt32());
            Assert.Single(search.GetProperty("items").EnumerateArray());
            Assert.False(search.GetProperty("items")[0].TryGetProperty("passwordHash", out _));
            var stats = await root.GetFromJsonAsync<JsonElement>("/api/admin/statistics");
            Assert.Equal(3, stats.GetProperty("users").GetInt32());
            Assert.Equal(1, stats.GetProperty("blocked").GetInt32());
            (await root.DeleteAsync($"/api/admin/users/{memberId}")).EnsureSuccessStatusCode();
            Assert.Equal(1, (await root.GetFromJsonAsync<JsonElement>("/api/admin/users?status=deleted")).GetProperty("total").GetInt32());
            (await root.PostAsync($"/api/admin/users/{memberId}/restore", null)).EnsureSuccessStatusCode();
            (await root.PutAsJsonAsync($"/api/admin/users/{memberId}/blocked", false)).EnsureSuccessStatusCode();
            await Authenticate(member, "member@example.test", "member-password");
            (await member.GetAsync("/api/user/me")).EnsureSuccessStatusCode();
            (await root.PutAsJsonAsync($"/api/admin/users/{delegateId}/role", 0)).EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Unauthorized, (await delegateAdmin.GetAsync("/api/admin/users")).StatusCode);
            await Authenticate(delegateAdmin, "delegate@example.test", "delegate-password");
            Assert.Equal(HttpStatusCode.Forbidden, (await delegateAdmin.GetAsync("/api/admin/users")).StatusCode);
        }
        finally
        {
            await using var drop = new NpgsqlCommand($"DROP DATABASE {databaseName} WITH (FORCE)", admin);
            await drop.ExecuteNonQueryAsync();
        }
    }
}
