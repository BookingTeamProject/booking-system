namespace TrailsUA.Domain.Entities;

public class Favorite
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid RouteId { get; set; }
    public Route Route { get; set; } = null!;

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}