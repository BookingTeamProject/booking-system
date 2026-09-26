namespace TrailsUA.Domain.Entities;

public enum BookingStatus { Pending, Confirmed, Cancelled, Declined }

public class Booking : BaseEntity
{
    public Guid RouteId { get; set; }
    public Route Route { get; set; } = null!;
    public Guid GuestId { get; set; }
    public User Guest { get; set; } = null!;
    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }
    public int Guests { get; set; }
    public decimal PricePerNight { get; set; }
    public decimal CleaningFee { get; set; }
    public decimal ServiceFee { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string? CancellationReason { get; set; }
}
