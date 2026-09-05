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

    public async Task<List<RouteDto>> GetUserFavoritesAsync(Guid userId)
    {
        var favorites = await _context.Favorites
            .Include(f => f.Route)
                .ThenInclude(r => r.Category)
            .Include(f => f.Route)
                .ThenInclude(r => r.Author)
            .Include(f => f.Route)
                .ThenInclude(r => r.Reviews)
            .Include(f => f.Route)
                .ThenInclude(r => r.Images)
            .Where(f => f.UserId == userId)
            .Select(f => f.Route)
            .ToListAsync();

        return favorites.Select(r => new RouteDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            Location = r.Location,
            Price = r.Price,
            CategoryName = r.Category?.Name ?? "Общая",
            AuthorName = $"{r.Author?.FirstName} {r.Author?.LastName}".Trim(),
            AverageRating = r.Reviews != null && r.Reviews.Any() ? Math.Round(r.Reviews.Average(rev => rev.Rating), 1) : 0,
            ImageUrls = r.Images != null ? r.Images.Select(img => img.Url).ToList() : new List<string>()
        }).ToList();
    }

    public async Task<bool> ToggleFavoriteAsync(Guid userId, Guid routeId)
    {
        var existing = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.RouteId == routeId);

        if (existing != null)
        {
            _context.Favorites.Remove(existing);
            await _context.SaveChangesAsync();
            return false; // Удалено из избранного
        }

        _context.Favorites.Add(new Favorite
        {
            UserId = userId,
            RouteId = routeId,
            AddedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
        return true; // Добавлено в избранное
    }
}