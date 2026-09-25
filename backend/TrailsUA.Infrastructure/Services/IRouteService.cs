using TrailsUA.Domain.DTOs.Route;

namespace TrailsUA.Infrastructure.Services;

public interface IRouteService
{
    Task<List<RouteDto>> GetAllRoutesAsync(string? search, Guid? categoryId, decimal? maxPrice);
    Task<List<RouteDto>> GetMyRoutesAsync(Guid userId);
    Task<RouteDto?> GetRouteByIdAsync(Guid id, string viewerId = "");
    Task<RouteDto> CreateRouteAsync(CreateRouteDto dto, Guid authorId);
    Task<bool> DeleteRouteAsync(Guid id, Guid authorId);

    Task<RouteDto?> UpdateRouteAsync(Guid id, UpdateRouteDto dto, Guid authorId);
}
