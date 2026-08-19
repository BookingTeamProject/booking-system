using TrailsUA.Domain.DTOs.Route;

namespace TrailsUA.Infrastructure.Services;

public interface IFavoriteService
{
    Task<List<RouteDto>> GetUserFavoritesAsync(Guid userId);
    Task<bool> AddToFavoritesAsync(Guid userId, Guid routeId);
    Task<bool> RemoveFromFavoritesAsync(Guid userId, Guid routeId);
}
