using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrailsUA.Domain.DTOs.Route;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RouteController : ControllerBase
{
    private readonly IRouteService _routeService;

    public RouteController(IRouteService routeService)
    {
        _routeService = routeService;
    }

    // GET /api/route?search=горы&categoryId=...&maxPrice=500 (ПОИСК И ФИЛЬТРАЦИЯ)
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] Guid? categoryId, [FromQuery] decimal? maxPrice)
    {
        var routes = await _routeService.GetAllRoutesAsync(search, categoryId, maxPrice);
        return Ok(routes);
    }

    // GET /api/route/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var route = await _routeService.GetRouteByIdAsync(id);
        if (route == null) return NotFound(new { message = "Маршрут не найден" });
        return Ok(route);
    }

    // POST /api/route (Только для авторизованных Арендодателей/Лендлордов и Админов)
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

    // DELETE /api/route/{id}
    [Authorize(Roles = "Landlord,Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _routeService.DeleteRouteAsync(id, userId);
        if (!result) return BadRequest(new { message = "Не удалось удалить маршрут (возможно, вы не автор)" });

        return Ok(new { message = "Маршрут успешно удален" });
    }
}