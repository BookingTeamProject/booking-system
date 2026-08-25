using TrailsUA.Domain.DTOs.Route;

namespace TrailsUA.Infrastructure.Services;

public interface IFavoriteService
{
    Task<List<RouteDto>> GetUserFavoritesAsync(Guid userId);
    Task<bool> ToggleFavoriteAsync(Guid userId, Guid routeId);
}