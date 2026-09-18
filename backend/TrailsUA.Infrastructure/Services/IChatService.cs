using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrailsUA.Domain.DTOs.Chat;

namespace TrailsUA.Infrastructure.Services;

public interface IChatService
{
    Task<List<ChatMessageDto>> GetMessagesByDialogIdAsync(string dialogId, Guid currentUserId);
    Task<ChatMessageDto> SendMessageAsync(Guid senderId, SendMessageDto dto);
}