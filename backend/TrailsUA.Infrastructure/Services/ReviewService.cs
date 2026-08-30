using Microsoft.EntityFrameworkCore;
using TrailsUA.Domain.DTOs.Review;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewDto>> GetReviewsByRouteIdAsync(Guid routeId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.RouteId == routeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            Rating = r.Rating,
            Text = r.Text,
            UserName = $"{r.User.FirstName} {r.User.LastName}".Trim(),
            UserAvatar = r.User.AvatarUrl,
            CreatedAt = r.CreatedAt
        }).ToList();
    }

    public async Task<ReviewDto> AddReviewAsync(Guid userId, CreateReviewDto dto)
    {
        var routeExists = await _context.Routes.AnyAsync(r => r.Id == dto.RouteId);
        if (!routeExists) throw new Exception("Маршрут не найден");

        var review = new Review
        {
            UserId = userId,
            RouteId = dto.RouteId,
            Rating = dto.Rating,
            Text = dto.Text
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);

        return new ReviewDto
        {
            Id = review.Id,
            Rating = review.Rating,
            Text = review.Text,
            UserName = $"{user?.FirstName} {user?.LastName}".Trim(),
            UserAvatar = user?.AvatarUrl,
            CreatedAt = review.CreatedAt
        };
    }
}