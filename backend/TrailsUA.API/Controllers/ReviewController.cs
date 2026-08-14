using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrailsUA.Domain.DTOs.Review;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // GET /api/review/route/{routeId} — Все отзывы маршрута
    [HttpGet("route/{routeId:guid}")]
    public async Task<IActionResult> GetByRouteId(Guid routeId)
    {
        var reviews = await _reviewService.GetReviewsByRouteIdAsync(routeId);
        return Ok(reviews);
    }

    // POST /api/review — Оставить отзыв
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddReview([FromBody] CreateReviewDto dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = Guid.Parse(userIdClaim!);

            var review = await _reviewService.AddReviewAsync(userId, dto);
            return Ok(review);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}