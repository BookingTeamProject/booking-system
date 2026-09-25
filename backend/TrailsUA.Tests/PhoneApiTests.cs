using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Tests;

public class PhoneApiTests
{
    [Fact]
    public async Task RegisterAndLoginAcceptFrontendPayloads()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using (var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options))
            await db.Database.EnsureCreatedAsync();
        await using var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder => {
            builder.UseSetting("JwtSettings:SecretKey", "phone-http-test-key-at-least-sixty-four-characters-12345678901234567890");
            builder.UseSetting("BootstrapAdmin:Email", "");
            builder.UseSetting("BootstrapAdmin:Password", "");
            builder.ConfigureServices(services => {
                services.RemoveAll<DbContextOptions<AppDbContext>>();
                services.RemoveAll<IDbContextOptionsConfiguration<AppDbContext>>();
                services.AddDbContext<AppDbContext>(options => options.UseSqlite(connection));
            });
        });
        using var client = factory.CreateClient();
        var register = await client.PostAsJsonAsync("/api/auth/register", new { email="phone-http@example.test",
            phoneNumber="+48512345678", password="test-password", firstName="Test", lastName="Phone", role=0 });
        register.EnsureSuccessStatusCode();
        var login = await client.PostAsJsonAsync("/api/auth/login", new { phoneNumber="+48512345678", password="test-password" });
        login.EnsureSuccessStatusCode();
        var result = await login.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("phone-http@example.test", result.GetProperty("user").GetProperty("email").GetString());
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/login", new {password="test-password"})).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/auth/register", new {
            email="duplicate@example.test", phoneNumber="+48512345678", password="test-password", firstName="Test", lastName="Duplicate", role=0 })).StatusCode);
    }
}
