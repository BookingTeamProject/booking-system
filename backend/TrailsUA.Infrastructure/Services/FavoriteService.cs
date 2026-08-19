using Microsoft.EntityFrameworkCore;
using TrailsUA.Domain.DTOs.Route;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services;

public class FavoriteService : IFavoriteService
{
    private readonly AppDbContext _context;
    public FavoriteService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<bool> AddToFavoritesAsync(Guid userId, Guid routeId)
    {
        var exist = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.RouteId == routeId);

        if (exist) return true;

        var favorite = new Favorite
        {
            UserId = userId,
            RouteId = routeId
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> RemoveFromFavoritesAsync(Guid userId, Guid routeId)
    {
        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.RouteId == routeId);

        if (favorite == null) return false;

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<RouteDto>> GetUserFavoritesAsync(Guid userId)
    {
        var favorites = await _context.Favorites
            .Include(f => f.Route).ThenInclude(r => r.Category)
            .Include(f => f.Route).ThenInclude(r => r.Author)
            .Include(f => f.Route).ThenInclude(r => r.Images)
            .Include(f => f.Route).ThenInclude(r => r.Reviews)
            .Where(f => f.UserId == userId)
            .Select(f => f.Route)
            .ToListAsync();

        return favorites.Select(r => new RouteDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            Location = r.Location,
            DistanceKm = r.DistanceKm,
            DurationHours = r.DurationHours,
            Price = r.Price,
            CreatedAt = r.CreatedAt,
            CategoryName = r.Category?.Name ?? "загальна",
            AuthorName = $"{r.Author?.FirstName} {r.Author?.LastName}".Trim(),
            AverageRating = r.Reviews != null && r.Reviews.Any() ? Math.Round(r.Reviews.Average(rev => rev.Rating), 1) : 0,
            ImageUrls = r.Images != null ? r.Images.Select(img => img.Url).ToList() : new List<string>()
        }).ToList();
    }
}

