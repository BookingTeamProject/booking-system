using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Создать новую заявку (Для гостя)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool hasOverlap = await _context.Bookings
                .Where(b => b.RouteId == request.RouteId && (b.Status == "Pending" || b.Status == "Approved"))
                .AnyAsync(b => request.CheckIn < b.CheckOut && request.CheckOut > b.CheckIn);

            if (hasOverlap)
            {
                // Если даты заняты, сервер откидывает запрос с ошибкой 400
                return BadRequest(new { message = "На жаль, ці дати вже зайняті іншим гостем." });
            }

            var booking = new Booking
            {
                RouteId = request.RouteId,
                GuestId = Guid.Parse(userId!),
                CheckIn = request.CheckIn,
                CheckOut = request.CheckOut,
                TotalPrice = request.TotalPrice,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        // 2. Получить заявки для хоста
        [HttpGet("host")]
        [Authorize]
        public async Task<IActionResult> GetHostBookings()
        {
            var hostId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var bookings = await _context.Bookings
                .Include(b => b.Route)
                .ThenInclude(r => r.Images)
                .Include(b => b.Guest)
                .Where(b => b.Route.AuthorId.ToString() == hostId)
                .ToListAsync();

            return Ok(bookings);
        }

        // 3. Изменить статус (Подтвердить/Отклонить)
        [HttpPut("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.Status = status;
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        // 4. Получить бронирования для авторизованного гостя
        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var bookings = await _context.Bookings
                .Include(b => b.Route)
                .ThenInclude(r => r.Images)
                .Where(b => b.GuestId.ToString() == userId)
                .ToListAsync();

            return Ok(bookings);
        }

        // Получить занятые даты для конкретного домика
        [HttpGet("route/{routeId}/unavailable-dates")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUnavailableDates(Guid routeId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.RouteId == routeId && (b.Status == "Pending" || b.Status == "Approved"))
                .Select(b => new {
                    start = b.CheckIn,
                    end = b.CheckOut
                })
                .ToListAsync();

            return Ok(bookings);
        }
    }

    // DTO для получения данных с фронта
    public class CreateBookingRequest
    {
        public Guid RouteId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public decimal TotalPrice { get; set; }
    }
}