using Microsoft.EntityFrameworkCore;
using Npgsql;
using TrailsUA.Domain.DTOs.Booking;
using TrailsUA.Domain.Entities;
using TrailsUA.Domain.Exceptions;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services;

public class BookingService(AppDbContext db, TimeProvider clock)
{
    private DateOnly Today => DateOnly.FromDateTime(clock.GetUtcNow().UtcDateTime);

    public async Task<BookingQuoteDto> QuoteAsync(CreateBookingDto dto, Guid guestId)
    {
        var route = await db.Routes.FindAsync(dto.RouteId)
            ?? throw new RequestException(404, "Помешкання не знайдено.");
        if (!await db.Users.AnyAsync(u => u.Id == route.AuthorId && !u.IsBlocked && !u.IsDeleted))
            throw new RequestException(409, "Помешкання тимчасово недоступне для бронювання.");
        if (route.AuthorId == guestId)
            throw new RequestException(400, "Не можна бронювати власне помешкання.");
        if (dto.CheckIn < Today || dto.CheckOut <= dto.CheckIn || dto.CheckOut.DayNumber - dto.CheckIn.DayNumber > 365)
            throw new RequestException(400, "Оберіть майбутній період від 1 до 365 ночей.");
        if (dto.Guests < 1 || dto.Guests > route.MaxGuests)
            throw new RequestException(400, $"Допустима кількість гостей: від 1 до {route.MaxGuests}.");
        if (route.Price is null or <= 0)
            throw new RequestException(400, "Для помешкання не задано ціну.");
        if (await db.Bookings.AnyAsync(b => b.RouteId == dto.RouteId &&
            (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed) &&
            b.CheckIn < dto.CheckOut && dto.CheckIn < b.CheckOut))
            throw new RequestException(409, "Помешкання вже заброньовано на ці дати.");

        var nights = dto.CheckOut.DayNumber - dto.CheckIn.DayNumber;
        var price = decimal.Round(route.Price.Value, 2, MidpointRounding.AwayFromZero);
        return new(nights, price, 300m, 150m, nights * price + 450m);
    }

    public async Task<BookingDto> CreateAsync(CreateBookingDto dto, Guid guestId)
    {
        var quote = await QuoteAsync(dto, guestId);
        var booking = new Booking
        {
            RouteId = dto.RouteId, GuestId = guestId, CheckIn = dto.CheckIn,
            CheckOut = dto.CheckOut, Guests = dto.Guests, PricePerNight = quote.PricePerNight,
            CleaningFee = quote.CleaningFee, ServiceFee = quote.ServiceFee, TotalPrice = quote.TotalPrice
        };
        db.Bookings.Add(booking);
        try { await db.SaveChangesAsync(); }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: "23P01" })
        {
            // PostgreSQL exclusion constraint also protects concurrent requests on different API instances.
            throw new RequestException(409, "Помешкання вже заброньовано на ці дати.");
        }
        return Map(await Query().SingleAsync(b => b.Id == booking.Id));
    }

    public async Task<List<BookingDto>> GetMineAsync(Guid userId, bool host)
    {
        var query = Query().Where(b => host ? b.Route.AuthorId == userId : b.GuestId == userId);
        return (await query.OrderByDescending(b => b.CreatedAt).ToListAsync()).Select(Map).ToList();
    }

    public async Task<List<UnavailableDatesDto>> GetUnavailableAsync(Guid routeId)
    {
        if (!await db.Routes.AnyAsync(r => r.Id == routeId))
            throw new RequestException(404, "Помешкання не знайдено.");
        return await db.Bookings.Where(b => b.RouteId == routeId && b.CheckOut > Today &&
            (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed))
            .OrderBy(b => b.CheckIn).Select(b => new UnavailableDatesDto(b.CheckIn, b.CheckOut)).ToListAsync();
    }

    public async Task<BookingDto> ChangeStatusAsync(Guid id, Guid userId, ChangeBookingStatusDto dto)
    {
        if (!Enum.TryParse<BookingStatus>(dto.Status, out var next) || !Enum.IsDefined(next))
            throw new RequestException(400, "Невідомий статус бронювання.");
        var booking = await Query().SingleOrDefaultAsync(b => b.Id == id)
            ?? throw new RequestException(404, "Бронювання не знайдено.");
        var isHost = booking.Route.AuthorId == userId;
        if (!isHost && booking.GuestId != userId)
            throw new RequestException(403, "Немає доступу до цього бронювання.");
        var allowed = isHost
            ? (booking.Status == BookingStatus.Pending && (next == BookingStatus.Confirmed || next == BookingStatus.Declined)) ||
              (booking.Status == BookingStatus.Confirmed && next == BookingStatus.Cancelled)
            : (booking.Status == BookingStatus.Pending || booking.Status == BookingStatus.Confirmed) && next == BookingStatus.Cancelled;
        if (!allowed || booking.CheckIn < Today)
            throw new RequestException(409, "Цей перехід статусу більше недоступний.");

        // Compare-and-swap prevents a simultaneous confirmation from undoing a cancellation.
        var changed = await db.Bookings.Where(b => b.Id == id && b.Status == booking.Status)
            .ExecuteUpdateAsync(s => s.SetProperty(b => b.Status, next)
                .SetProperty(b => b.CancellationReason, next == BookingStatus.Cancelled || next == BookingStatus.Declined ? dto.Reason : null)
                .SetProperty(b => b.UpdatedAt, clock.GetUtcNow().UtcDateTime));
        if (changed == 0) throw new RequestException(409, "Статус уже змінено. Оновіть список.");
        return Map(await Query().SingleAsync(b => b.Id == id));
    }

    private IQueryable<Booking> Query() => db.Bookings.AsNoTracking()
        .Include(b => b.Guest).Include(b => b.Route).ThenInclude(r => r.Author)
        .Include(b => b.Route).ThenInclude(r => r.Images);

    private BookingDto Map(Booking b) => new(b.Id, b.RouteId, b.Route.Title, b.Route.Location,
        b.Route.Images.FirstOrDefault()?.Url, b.GuestId, $"{b.Guest.FirstName} {b.Guest.LastName}".Trim(),
        b.Route.AuthorId, $"{b.Route.Author.FirstName} {b.Route.Author.LastName}".Trim(),
        b.CheckIn, b.CheckOut, b.Guests, b.PricePerNight, b.CleaningFee, b.ServiceFee, b.TotalPrice,
        b.Status == BookingStatus.Confirmed && b.CheckOut <= Today ? "Completed" : b.Status.ToString(), b.CancellationReason);
}
