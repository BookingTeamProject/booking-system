using System;

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
    public string DialogId { get; set; } = "c1";
    public string Text { get; set; } = string.Empty;
}