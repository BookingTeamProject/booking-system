using System;

namespace TrailsUA.Domain.Entities
{
    public class Booking : BaseEntity
    {
        public Guid RouteId { get; set; }
        public Route Route { get; set; } = null!;

        public Guid GuestId { get; set; }
        public User Guest { get; set; } = null!;

        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public decimal TotalPrice { get; set; }

        public string Status { get; set; } = "Pending";
    }
}