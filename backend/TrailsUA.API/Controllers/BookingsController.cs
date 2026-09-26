using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrailsUA.Domain.DTOs.Booking;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[ApiController, Authorize, Route("api/bookings")]
public class BookingsController(BookingService service) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingDto dto)
    {
        var booking = await service.CreateAsync(dto, UserId);
        return StatusCode(201, booking);
    }

    [HttpPost("quote")]
    public async Task<IActionResult> Quote(CreateBookingDto dto) => Ok(await service.QuoteAsync(dto, UserId));

    [HttpGet("my")]
    public async Task<IActionResult> Mine() => Ok(await service.GetMineAsync(UserId, false));

    [HttpGet("host"), Authorize(Roles = "Landlord,Admin")]
    public async Task<IActionResult> Host() => Ok(await service.GetMineAsync(UserId, true));

    [HttpGet("route/{routeId:guid}/unavailable-dates"), AllowAnonymous]
    public async Task<IActionResult> Unavailable(Guid routeId) => Ok(await service.GetUnavailableAsync(routeId));

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> ChangeStatus(Guid id, ChangeBookingStatusDto dto) =>
        Ok(await service.ChangeStatusAsync(id, UserId, dto));
}
