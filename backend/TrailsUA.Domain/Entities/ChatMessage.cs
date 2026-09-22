using System;

namespace TrailsUA.Domain.Entities;

public class ChatMessage : BaseEntity
{
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public string DialogId { get; set; } = "c1";
    public string Text { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
}