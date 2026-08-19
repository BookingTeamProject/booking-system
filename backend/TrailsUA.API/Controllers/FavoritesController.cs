using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }
    [HttpPost("{routeId:guid}")]
    public async Task<IActionResult> AddToFavorites(Guid routeId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        await _favoriteService.AddToFavoritesAsync(userId, routeId);
        return Ok(new { Message = "Маршрут додано до обраних" });
    }

    [HttpDelete("{routeId:guid}")]
    public async Task<IActionResult> RemoveFromFavorites(Guid routeId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _favoriteService.RemoveFromFavoritesAsync(userId, routeId);
        if (!result)
            return NotFound(new { Message = "Маршрут не знайдено в обраних" });
        return Ok(new { Message = "Маршрут видалено з обраних" });
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
        return Ok(favorites);
    }
}