using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrailsUA.Domain.DTOs.Chat;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Domain.Exceptions;

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
        dialogId = await AuthorizeDialogAsync(dialogId, currentUserId);
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
            IsHost = m.SenderId == currentUserId
        }).ToList();
    }

    public async Task<ChatMessageDto> SendMessageAsync(Guid senderId, SendMessageDto dto)
    {
        var dialogId = await AuthorizeDialogAsync(dto.DialogId, senderId);
        if (string.IsNullOrWhiteSpace(dto.Text) || dto.Text.Length > 4000)
            throw new RequestException(400, "Повідомлення має містити від 1 до 4000 символів.");
        var user = await _context.Users.FindAsync(senderId);
        if (user == null) throw new RequestException(401, "Потрібно увійти.");

        var message = new ChatMessage
        {
            SenderId = senderId,
            DialogId = dialogId,
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
            IsHost = true
        };
    }
    // One conversation per booking. A role alone never grants access.
    private async Task<string> AuthorizeDialogAsync(string dialogId, Guid userId)
    {
        if (userId == Guid.Empty) throw new RequestException(401, "Потрібно увійти.");
        if (!Guid.TryParse(dialogId, out var bookingId))
            throw new RequestException(404, "Діалог недоступний.");
        var participant = await _context.Bookings.AsNoTracking().AnyAsync(b => b.Id == bookingId &&
            (b.GuestId == userId || b.Route.AuthorId == userId));
        if (!participant) throw new RequestException(404, "Діалог недоступний.");
        return bookingId.ToString();
    }
}