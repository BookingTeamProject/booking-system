using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoriteController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoriteController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    // GET /api/favorite — Все избранные маршруты пользователя
    [HttpGet]
    public async Task<IActionResult> GetMyFavorites()
    {
        var userId = GetCurrentUserId();
        var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
        return Ok(favorites);
    }

    // POST /api/favorite/{routeId} — Добавить / Удалить из избранного
    [HttpPost("{routeId:guid}")]
    public async Task<IActionResult> Toggle(Guid routeId)
    {
        var userId = GetCurrentUserId();
        var isAdded = await _favoriteService.ToggleFavoriteAsync(userId, routeId);
        return Ok(new { isFavorite = isAdded, message = isAdded ? "Добавлено в избранное" : "Удалено из избранного" });
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(claim!);
    }
}