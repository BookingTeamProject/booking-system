using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrailsUA.Domain.DTOs.Chat;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services;

public class ChatService : IChatService
{
    private readonly AppDbContext _context;

    public ChatService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ChatMessageDto>> GetMessagesByDialogIdAsync(string dialogId, Guid currentUserId)
    {
        var messages = await _context.ChatMessages
            .Include(m => m.Sender)
            .Where(m => m.DialogId == dialogId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        return messages.Select(m => new ChatMessageDto
        {
            Id = m.Id,
            SenderName = $"{m.Sender.FirstName} {m.Sender.LastName}".Trim(),
            SenderAvatar = m.Sender.AvatarUrl,
            Text = m.Text,
            Time = m.CreatedAt.ToString("HH:mm"),
            IsHost = m.Sender.Role == UserRole.Landlord || m.SenderId == currentUserId
        }).ToList();
    }

    public async Task<ChatMessageDto> SendMessageAsync(Guid senderId, SendMessageDto dto)
    {
        var user = await _context.Users.FindAsync(senderId);
        if (user == null) throw new Exception("Користувача не знайдено");

        var message = new ChatMessage
        {
            SenderId = senderId,
            DialogId = string.IsNullOrWhiteSpace(dto.DialogId) ? "c1" : dto.DialogId,
            Text = dto.Text.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();

        return new ChatMessageDto
        {
            Id = message.Id,
            SenderName = $"{user.FirstName} {user.LastName}".Trim(),
            SenderAvatar = user.AvatarUrl,
            Text = message.Text,
            Time = message.CreatedAt.ToString("HH:mm"),
            IsHost = user.Role == UserRole.Landlord
        };
    }
}