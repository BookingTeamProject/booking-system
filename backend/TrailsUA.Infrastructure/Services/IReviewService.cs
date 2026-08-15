using TrailsUA.Domain.DTOs.Review;

namespace TrailsUA.Infrastructure.Services;

public interface IReviewService
{
    Task<List<ReviewDto>> GetReviewsByRouteIdAsync(Guid routeId);
    Task<ReviewDto> AddReviewAsync(Guid userId, CreateReviewDto dto);
}