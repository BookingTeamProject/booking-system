using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrailsUA.Domain.DTOs.Route;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly IRouteService _routeService;

    public RoutesController(IRouteService routeService)
    {
        _routeService = routeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] Guid? categoryId, [FromQuery] decimal? maxPrice)
    {
        var routes = await _routeService.GetAllRoutesAsync(search, categoryId, maxPrice);
        return Ok(routes);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var route = await _routeService.GetRouteByIdAsync(id);
        if (route == null) return NotFound(new { message = "Маршрут не найден" });
        return Ok(route);
    }

    [Authorize(Roles = "Landlord,Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRouteDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var route = await _routeService.CreateRouteAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = route.Id }, route);
    }

    [Authorize(Roles = "Landlord,Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _routeService.DeleteRouteAsync(id, userId);
        if (!result) return BadRequest(new { message = "Не удалось удалить маршрут" });

        return Ok(new { message = "Маршрут успешно удален" });
    }
    [Authorize(Roles = "Landlord,Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRouteDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        return Unauthorized();

        var updatedRoute = await _routeService.UpdateRouteAsync(id, dto, userId);
        if (updatedRoute == null) 
            return BadRequest(new { message = "Маршрут не найден или вы не являетесь владельцем маршрута" });
        return Ok(updatedRoute);
    }
}