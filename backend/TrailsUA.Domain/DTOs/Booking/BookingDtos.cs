using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Booking;

public class CreateBookingDto
{
    public Guid RouteId { get; set; }
    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }
    [Range(1, 100)] public int Guests { get; set; } = 1;
}

public class ChangeBookingStatusDto
{
    [Required] public string Status { get; set; } = string.Empty;
    [MaxLength(1000)] public string? Reason { get; set; }
}

public record BookingQuoteDto(int Nights, decimal PricePerNight, decimal CleaningFee,
    decimal ServiceFee, decimal TotalPrice);

public record BookingDto(Guid Id, Guid RouteId, string Title, string Location, string? ImageUrl,
    Guid GuestId, string GuestName, Guid HostId, string HostName,
    DateOnly CheckIn, DateOnly CheckOut, int Guests, decimal PricePerNight,
    decimal CleaningFee, decimal ServiceFee, decimal TotalPrice, string Status,
    string? CancellationReason);

public record UnavailableDatesDto(DateOnly Start, DateOnly End);
