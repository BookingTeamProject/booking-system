using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TrailsUA.Domain.DTOs.Auth;
using TrailsUA.Domain.DTOs.Booking;
using TrailsUA.Domain.Entities;
using TrailsUA.Domain.Exceptions;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Infrastructure.Services;
using Route = TrailsUA.Domain.Entities.Route;

namespace TrailsUA.Tests;

public class BookingTests : IDisposable
{
    private readonly SqliteConnection connection = new("Data Source=:memory:");
    private readonly AppDbContext db;
    private readonly BookingService service;
    private readonly User host = new() { Email = "host@example.test", Role = UserRole.Landlord };
    private readonly User guest = new() { Email = "guest@example.test" };
    private readonly User stranger = new() { Email = "stranger@example.test" };
    private readonly Route route;
    private readonly FixedClock clock = new();

    public BookingTests()
    {
        connection.Open();
        db = new(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
        db.Database.EnsureCreated();
        var category = new Category { Name = "House" };
        route = new() { Author = host, Category = category, Title = "Test house", Price = 1500.25m, MaxGuests = 3 };
        db.AddRange(host, guest, stranger, route);
        db.SaveChanges();
        service = new(db, clock);
    }

    private CreateBookingDto Request(int start = 10, int end = 13, int guests = 2) => new()
    {
        RouteId = route.Id, CheckIn = new(2030, 1, start), CheckOut = new(2030, 1, end), Guests = guests
    };

    [Fact]
    public async Task BookingPersistsServerPriceAndAppearsOnlyForParticipants()
    {
        var booking = await service.CreateAsync(Request(), guest.Id);
        Assert.Equal(4950.75m, booking.TotalPrice);
        Assert.Equal("Pending", booking.Status);
        Assert.Equal(2, booking.Guests);
        db.ChangeTracker.Clear();
        Assert.Single(await service.GetMineAsync(guest.Id, false));
        Assert.Single(await service.GetMineAsync(host.Id, true));
        Assert.Empty(await service.GetMineAsync(stranger.Id, false));
        Assert.Empty(await service.GetMineAsync(stranger.Id, true));
        var storedRoute = await db.Routes.FindAsync(route.Id);
        storedRoute!.Price = 9000;
        await db.SaveChangesAsync();
        Assert.Equal(4950.75m, (await service.GetMineAsync(guest.Id, false)).Single().TotalPrice);
    }

    [Theory]
    [InlineData(9, 11)]
    [InlineData(11, 12)]
    [InlineData(12, 14)]
    [InlineData(9, 14)]
    [InlineData(10, 13)]
    public async Task OverlappingBookingsAreRejected(int start, int end)
    {
        await service.CreateAsync(Request(), guest.Id);
        var error = await Assert.ThrowsAsync<RequestException>(() => service.CreateAsync(Request(start, end), stranger.Id));
        Assert.Equal(409, error.StatusCode);
        Assert.Single(await db.Bookings.ToListAsync());
    }

    [Fact]
    public async Task CheckoutIsExclusiveAndAdjacentBookingsAreAllowed()
    {
        await service.CreateAsync(Request(), guest.Id);
        await service.CreateAsync(Request(13, 15), stranger.Id);
        await service.CreateAsync(Request(8, 10), stranger.Id);
        Assert.Equal(3, (await service.GetUnavailableAsync(route.Id)).Count);
    }

    [Theory]
    [InlineData(10, 10, 1)]
    [InlineData(13, 10, 1)]
    [InlineData(10, 13, 0)]
    [InlineData(10, 13, 4)]
    public async Task InvalidDatesAndCapacityAreRejected(int start, int end, int guests)
    {
        var error = await Assert.ThrowsAsync<RequestException>(() => service.CreateAsync(Request(start, end, guests), guest.Id));
        Assert.Equal(400, error.StatusCode);
    }

    [Fact]
    public async Task PastDatesAndOwnPropertyAreRejected()
    {
        var request = Request();
        request.CheckIn = new(2029, 12, 30);
        Assert.Equal(400, (await Assert.ThrowsAsync<RequestException>(() => service.CreateAsync(request, guest.Id))).StatusCode);
        Assert.Equal(400, (await Assert.ThrowsAsync<RequestException>(() => service.CreateAsync(Request(), host.Id))).StatusCode);
    }

    [Fact]
    public async Task HostConfirmsGuestCancelsAndDatesBecomeAvailable()
    {
        var booking = await service.CreateAsync(Request(), guest.Id);
        Assert.Equal("Confirmed", (await service.ChangeStatusAsync(booking.Id, host.Id, new() { Status = "Confirmed" })).Status);
        Assert.Single(await service.GetUnavailableAsync(route.Id));
        var cancelled = await service.ChangeStatusAsync(booking.Id, guest.Id, new() { Status = "Cancelled", Reason = "Plans changed" });
        Assert.Equal("Cancelled", cancelled.Status);
        Assert.Equal("Plans changed", cancelled.CancellationReason);
        Assert.Empty(await service.GetUnavailableAsync(route.Id));
        await service.CreateAsync(Request(), stranger.Id);
        Assert.Equal(409, (await Assert.ThrowsAsync<RequestException>(() => service.ChangeStatusAsync(booking.Id, host.Id, new() { Status = "Confirmed" }))).StatusCode);
    }

    [Fact]
    public async Task StrangersCannotMutateAndGuestsCannotConfirm()
    {
        var booking = await service.CreateAsync(Request(), guest.Id);
        Assert.Equal(403, (await Assert.ThrowsAsync<RequestException>(() => service.ChangeStatusAsync(booking.Id, stranger.Id, new() { Status = "Cancelled" }))).StatusCode);
        Assert.Equal(409, (await Assert.ThrowsAsync<RequestException>(() => service.ChangeStatusAsync(booking.Id, guest.Id, new() { Status = "Confirmed" }))).StatusCode);
        Assert.Equal(400, (await Assert.ThrowsAsync<RequestException>(() => service.ChangeStatusAsync(booking.Id, host.Id, new() { Status = "Invalid" }))).StatusCode);
        Assert.Equal("Declined", (await service.ChangeStatusAsync(booking.Id, host.Id, new() { Status = "Declined" })).Status);
        Assert.Empty(await service.GetUnavailableAsync(route.Id));
    }

    [Fact]
    public async Task CompletedStayIsHistoryAndCannotBeCancelled()
    {
        var booking = await service.CreateAsync(Request(), guest.Id);
        await service.ChangeStatusAsync(booking.Id, host.Id, new() { Status = "Confirmed" });
        clock.Now = new(2030, 1, 14, 0, 0, 0, TimeSpan.Zero);
        Assert.Equal("Completed", (await service.GetMineAsync(guest.Id, false)).Single().Status);
        Assert.Equal(409, (await Assert.ThrowsAsync<RequestException>(() => service.ChangeStatusAsync(booking.Id, guest.Id, new() { Status = "Cancelled" }))).StatusCode);
    }

    [Theory]
    [InlineData(UserRole.Admin)]
    [InlineData(UserRole.Moderator)]
    [InlineData((UserRole)99)]
    public async Task PublicRegistrationCannotGrantPrivilegedRoles(UserRole role)
    {
        var auth = new AuthService(db, new ConfigurationBuilder().Build());
        await Assert.ThrowsAsync<ArgumentException>(() => auth.RegisterAsync(new RegisterDto { Email = "new@example.test", Password = "test-password", Role = role }));
        Assert.False(await db.Users.AnyAsync(u => u.Email == "new@example.test"));
    }

    public void Dispose() { db.Dispose(); connection.Dispose(); }

    private sealed class FixedClock : TimeProvider
    {
        public DateTimeOffset Now { get; set; } = new(2030, 1, 1, 0, 0, 0, TimeSpan.Zero);
        public override DateTimeOffset GetUtcNow() => Now;
    }
}
