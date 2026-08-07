namespace TrailsUA.Domain.DTOs.Route;

public class RouteDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public double DistanceKm { get; set; }
    public int DurationHours { get; set; }
    public decimal? Price { get; set; }
    public DateTime CreatedAt { get; set; }

    public string CategoryName { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public double AverageRating { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}