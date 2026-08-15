using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Review;

public class ReviewDto
{
    public Guid Id { get; set; }
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    [Required]
    public Guid RouteId { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required, MinLength(3)]
    public string Text { get; set; } = string.Empty;
}