namespace TrailsUA.Domain.DTOs.Routes;

public class CreateRouteDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Location { get; set; } = null!;  // Например: "Карпаты, Яремче"
    public double DistanceKm { get; set; }               // Длина маршрута в км
    public int DurationHours { get; set; }               // Примерное время в часах
    public decimal? Price { get; set; }                  // Цена (если это платный тур или аренда)
    public Guid CategoryId { get; set; }
}