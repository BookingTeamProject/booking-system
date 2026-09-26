using System;
using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Chat;

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string? SenderAvatar { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public bool IsHost { get; set; }
}

public class SendMessageDto
{
    [Required, MaxLength(36)]
    public string DialogId { get; set; } = string.Empty;
    [Required, MaxLength(4000)]
    public string Text { get; set; } = string.Empty;
}