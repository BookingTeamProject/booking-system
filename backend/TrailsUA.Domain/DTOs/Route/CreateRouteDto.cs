using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Route;

public class CreateRouteDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = string.Empty;

    [Range(0.01, 1000000)]
    public decimal? Price { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    [Range(1, 100)]
    public int MaxGuests { get; set; } = 4;

    public List<string> ImageUrls { get; set; } = new();
}