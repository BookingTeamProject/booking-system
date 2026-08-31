using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Route;

public class UpdateRouteDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
    [Required]
    public string Location { get; set; } = string.Empty;
    [Range(0.1, 1000)]
    public double DistanceKm { get; set; }
    [Range(1, 500)]
    public int DurationHours { get; set; }
    public decimal? Price { get; set; }
    [Required]
    public Guid CategoryId { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}