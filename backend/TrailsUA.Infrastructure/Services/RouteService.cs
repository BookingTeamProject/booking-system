using Microsoft.EntityFrameworkCore;
using TrailsUA.Domain.DTOs.Route;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services;

public class RouteService : IRouteService
{
    private readonly AppDbContext _context;

    public RouteService(AppDbContext context)
    {
        _context = context;
    }

    // Получение списка с ПОИСКОМ и ФИЛЬТРАЦИЕЙ
    public async Task<List<RouteDto>> GetAllRoutesAsync(string? search, Guid? categoryId, decimal? maxPrice)
    {
        var query = _context.Routes
            .Include(r => r.Category)
            .Include(r => r.Author)
            .Include(r => r.Reviews)
            .Include(r => r.Images)
            .AsQueryable();

        // Поиск по названию или описанию
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(r => r.Title.ToLower().Contains(searchLower) || r.Description.ToLower().Contains(searchLower) || r.Location.ToLower().Contains(searchLower));
        }

        // Фильтр по категории
        if (categoryId.HasValue)
        {
            query = query.Where(r => r.CategoryId == categoryId.Value);
        }

        // Фильтр по максимальной цене
        if (maxPrice.HasValue)
        {
            query = query.Where(r => r.Price <= maxPrice.Value);
        }

        var routes = await query.ToListAsync();

        return routes.Select(r => MapToDto(r)).ToList();
    }

    public async Task<RouteDto?> GetRouteByIdAsync(Guid id)
    {
        var route = await _context.Routes
            .Include(r => r.Category)
            .Include(r => r.Author)
            .Include(r => r.Reviews)
            .Include(r => r.Images)
            .FirstOrDefaultAsync(r => r.Id == id);

        return route == null ? null : MapToDto(route);
    }

    public async Task<RouteDto> CreateRouteAsync(CreateRouteDto dto, Guid authorId)
    {
        var route = new Route
        {
            Title = dto.Title,
            Description = dto.Description,
            Location = dto.Location,
            DistanceKm = dto.DistanceKm,
            DurationHours = dto.DurationHours,
            Price = dto.Price,
            CategoryId = dto.CategoryId,
            AuthorId = authorId
        };

        if (dto.ImageUrls.Any())
        {
            foreach (var url in dto.ImageUrls)
            {
                route.Images.Add(new Image { Url = url });
            }
        }

        _context.Routes.Add(route);
        await _context.SaveChangesAsync();

        return await GetRouteByIdAsync(route.Id) ?? MapToDto(route);
    }

    public async Task<bool> DeleteRouteAsync(Guid id, Guid authorId)
    {
        var route = await _context.Routes.FirstOrDefaultAsync(r => r.Id == id && r.AuthorId == authorId);
        if (route == null) return false;

        _context.Routes.Remove(route);
        await _context.SaveChangesAsync();
        return true;
    }

    private static RouteDto MapToDto(Route r)
    {
        return new RouteDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            Location = r.Location,
            DistanceKm = r.DistanceKm,
            DurationHours = r.DurationHours,
            Price = r.Price,
            CreatedAt = r.CreatedAt,
            CategoryName = r.Category?.Name ?? "Общая",
            AuthorName = $"{r.Author?.FirstName} {r.Author?.LastName}".Trim(),
            AverageRating = r.Reviews.Any() ? Math.Round(r.Reviews.Average(rev => rev.Rating), 1) : 0,
            ImageUrls = r.Images.Select(img => img.Url).ToList()
        };
    }
}