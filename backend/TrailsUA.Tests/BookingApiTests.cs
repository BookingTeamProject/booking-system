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

public class BookingApiTests
{
    [PostgresFact]
    public async Task HttpFlowEnforcesAuthenticationOwnershipAndServerPricing()
    {
        var adminConnection = Environment.GetEnvironmentVariable("TEST_POSTGRES_CONNECTION")!;
        var databaseName = "trailsua_api_test_" + Guid.NewGuid().ToString("N");
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
                builder.ConfigureServices(services =>
                {
                    services.RemoveAll<DbContextOptions<AppDbContext>>();
                    services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connection));
                });
            });
            using var anonymous = factory.CreateClient();
            using var host = factory.CreateClient();
            using var guest = factory.CreateClient();
            using var stranger = factory.CreateClient();
            Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync("/api/bookings/my")).StatusCode);
            Assert.Equal(HttpStatusCode.BadRequest, (await anonymous.PostAsJsonAsync("/api/auth/register", new
            { email = "admin@example.test", password = "test-password", firstName = "Test", lastName = "User", role = 3 })).StatusCode);

            async Task Register(HttpClient client, string email, int role)
            {
                var response = await client.PostAsJsonAsync("/api/auth/register", new
                { email, password = "test-password", firstName = "Test", lastName = "User", role });
                response.EnsureSuccessStatusCode();
                var body = await response.Content.ReadFromJsonAsync<JsonElement>();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", body.GetProperty("accessToken").GetString());
            }
            await Register(host, "host@example.test", 1);
            await Register(guest, "guest@example.test", 0);
            await Register(stranger, "stranger@example.test", 0);
            var categories = await anonymous.GetFromJsonAsync<JsonElement>("/api/categories");
            var createdRoute = await host.PostAsJsonAsync("/api/routes", new
            { title = "API test house", description = "Test", location = "Test location", price = 1000, maxGuests = 2, categoryId = categories[0].GetProperty("id").GetString(), imageUrls = Array.Empty<string>() });
            Assert.Equal(HttpStatusCode.Created, createdRoute.StatusCode);
            var route = await createdRoute.Content.ReadFromJsonAsync<JsonElement>();
            var routeId = route.GetProperty("id").GetGuid();
            Assert.Equal(2, route.GetProperty("maxGuests").GetInt32());
            Assert.Single((await host.GetFromJsonAsync<JsonElement>("/api/routes/mine")).EnumerateArray());
            var start = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(10);
            var request = new { routeId, checkIn = start.ToString("yyyy-MM-dd"), checkOut = start.AddDays(3).ToString("yyyy-MM-dd"), guests = 2, totalPrice = 1 };
            var response = await guest.PostAsJsonAsync("/api/bookings", request);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var booking = (await response.Content.ReadFromJsonAsync<BookingDto>())!;
            Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.GetAsync($"/api/chat/{booking.Id}")).StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, (await anonymous.PostAsJsonAsync("/api/chat/send", new { dialogId = booking.Id, text = "hello" })).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, (await stranger.GetAsync($"/api/chat/{booking.Id}")).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, (await stranger.PostAsJsonAsync("/api/chat/send", new { dialogId = booking.Id, text = "intrusion" })).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, (await guest.GetAsync("/api/chat/c1")).StatusCode);
            Assert.Equal(HttpStatusCode.BadRequest, (await guest.PostAsJsonAsync("/api/chat/send", new { dialogId = booking.Id, text = "   " })).StatusCode);
            Assert.Equal(HttpStatusCode.BadRequest, (await guest.PostAsJsonAsync("/api/chat/send", new { dialogId = booking.Id, text = new string('x', 4001) })).StatusCode);
            (await guest.PostAsJsonAsync("/api/chat/send", new { dialogId = booking.Id, text = "  Arrival time?  " })).EnsureSuccessStatusCode();
            var hostMessages = await host.GetFromJsonAsync<TrailsUA.Domain.DTOs.Chat.ChatMessageDto[]>($"/api/chat/{booking.Id.ToString().ToUpperInvariant()}");
            Assert.Equal("Arrival time?", Assert.Single(hostMessages!).Text);
            Assert.False(hostMessages![0].IsHost);
            (await host.PostAsJsonAsync("/api/chat/send", new { dialogId = booking.Id, text = "After 14:00" })).EnsureSuccessStatusCode();
            var guestMessages = await guest.GetFromJsonAsync<TrailsUA.Domain.DTOs.Chat.ChatMessageDto[]>($"/api/chat/{booking.Id}");
            Assert.Equal(2, guestMessages!.Length);
            Assert.True(guestMessages[0].IsHost);
            Assert.False(guestMessages[1].IsHost);
            Assert.Equal(3450m, booking.TotalPrice); // A manipulated browser price is ignored.
            Assert.Equal(HttpStatusCode.Conflict, (await stranger.PostAsJsonAsync("/api/bookings", request)).StatusCode);
            Assert.Equal(HttpStatusCode.Forbidden, (await stranger.PutAsJsonAsync($"/api/bookings/{booking.Id}/status", new { status = "Cancelled" })).StatusCode);
            Assert.Equal(HttpStatusCode.Forbidden, (await guest.GetAsync("/api/bookings/host")).StatusCode);
            Assert.Empty((await stranger.GetFromJsonAsync<BookingDto[]>("/api/bookings/my"))!);
            Assert.Single((await host.GetFromJsonAsync<BookingDto[]>("/api/bookings/host"))!);
            Assert.Equal(HttpStatusCode.OK, (await host.PutAsJsonAsync($"/api/bookings/{booking.Id}/status", new { status = "Confirmed" })).StatusCode);
            Assert.Equal("Confirmed", (await guest.GetFromJsonAsync<BookingDto[]>("/api/bookings/my"))!.Single().Status);
            Assert.Equal(HttpStatusCode.Conflict, (await host.DeleteAsync($"/api/routes/{routeId}")).StatusCode);
            Assert.Equal(HttpStatusCode.OK, (await guest.PutAsJsonAsync($"/api/bookings/{booking.Id}/status", new { status = "Cancelled", reason = "Changed plans" })).StatusCode);
            Assert.Empty((await anonymous.GetFromJsonAsync<UnavailableDatesDto[]>($"/api/bookings/route/{routeId}/unavailable-dates"))!);
            Assert.Equal(HttpStatusCode.Created, (await stranger.PostAsJsonAsync("/api/bookings", request)).StatusCode);
        }
        finally
        {
            await using var drop = new NpgsqlCommand($"DROP DATABASE {databaseName} WITH (FORCE)", admin);
            await drop.ExecuteNonQueryAsync();
        }
    }
}
