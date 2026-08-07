namespace TrailsUA.Domain.Entities;

public class Review : BaseEntity
{
    public int Rating { get; set; } // Оценка от 1 до 5
    public string Text { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid RouteId { get; set; }
    public Route Route { get; set; } = null!;
}