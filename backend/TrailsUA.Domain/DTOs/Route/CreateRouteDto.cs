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

    public decimal? Price { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    public List<string> ImageUrls { get; set; } = new();
}