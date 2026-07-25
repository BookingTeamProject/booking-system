namespace TrailsUA.Domain.Entities;

public class Image : BaseEntity
{
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; } = false; // Главное ли это фото

    public Guid? RouteId { get; set; }
    public Route? Route { get; set; }
}