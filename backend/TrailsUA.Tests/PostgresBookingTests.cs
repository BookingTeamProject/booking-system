using Microsoft.EntityFrameworkCore;
using Npgsql;
using TrailsUA.Domain.DTOs.Booking;
using TrailsUA.Domain.Entities;
using TrailsUA.Domain.Exceptions;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.Tests;

public sealed class PostgresFactAttribute : FactAttribute
{
    public PostgresFactAttribute()
    {
        if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_POSTGRES_CONNECTION")))
            Skip = "Set TEST_POSTGRES_CONNECTION to a local PostgreSQL instance with CREATE DATABASE permission.";
    }
}

public class PostgresBookingTests
{
    [PostgresFact]
    public async Task MigrationsAndConcurrentRequestsPreserveExclusiveDates()
    {
        var adminConnection = Environment.GetEnvironmentVariable("TEST_POSTGRES_CONNECTION")!;
        var databaseName = "trailsua_test_" + Guid.NewGuid().ToString("N");
        await using var admin = new NpgsqlConnection(adminConnection);
        await admin.OpenAsync();
        await using (var create = new NpgsqlCommand($"CREATE DATABASE {databaseName}", admin)) await create.ExecuteNonQueryAsync();
        var connectionString = new NpgsqlConnectionStringBuilder(adminConnection) { Database = databaseName, Pooling = false }.ConnectionString;
        var options = new DbContextOptionsBuilder<AppDbContext>().UseNpgsql(connectionString).Options;
        try
        {
            Guid routeId, guestId;
            await using (var seed = new AppDbContext(options))
            {
                await seed.Database.MigrateAsync();
                var host = new User { Email = "host@example.test", Role = UserRole.Landlord };
                var guest = new User { Email = "guest@example.test" };
                var route = new TrailsUA.Domain.Entities.Route { Title = "House", Author = host, Price = 1000, Category = new Category { Name = "House" } };
                seed.AddRange(route, guest);
                await seed.SaveChangesAsync();
                routeId = route.Id; guestId = guest.Id;
            }
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var request = new CreateBookingDto { RouteId = routeId, CheckIn = today.AddDays(10), CheckOut = today.AddDays(13), Guests = 2 };
            async Task<int> Attempt()
            {
                await using var db = new AppDbContext(options);
                try { await new BookingService(db, TimeProvider.System).CreateAsync(request, guestId); return 201; }
                catch (RequestException ex) { return ex.StatusCode; }
            }
            var results = await Task.WhenAll(Enumerable.Range(0, 8).Select(_ => Attempt()));
            Assert.Single(results, status => status == 201);
            Assert.Equal(7, results.Count(status => status == 409));
            await using var verify = new AppDbContext(options);
            Assert.Single(await verify.Bookings.ToListAsync());

            // Bypass application validation to verify the actual PostgreSQL constraint.
            verify.Bookings.Add(new Booking { RouteId = routeId, GuestId = guestId,
                CheckIn = request.CheckIn, CheckOut = request.CheckOut, Guests = 1,
                PricePerNight = 1000, TotalPrice = 3000 });
            var error = await Assert.ThrowsAsync<DbUpdateException>(() => verify.SaveChangesAsync());
            Assert.Equal("23P01", Assert.IsType<PostgresException>(error.InnerException).SqlState);
        }
        finally
        {
            await using var drop = new NpgsqlCommand($"DROP DATABASE {databaseName} WITH (FORCE)", admin);
            await drop.ExecuteNonQueryAsync();
        }
    }
}
