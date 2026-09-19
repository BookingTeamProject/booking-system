using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TrailsUA.Domain.DTOs.Chat;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    // GET: /api/chat/{dialogId}
    [HttpGet("{dialogId}")]
    public async Task<IActionResult> GetMessages(string dialogId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentUserId = userIdClaim != null ? Guid.Parse(userIdClaim) : Guid.Empty;

        var messages = await _chatService.GetMessagesByDialogIdAsync(dialogId, currentUserId);
        return Ok(messages);
    }

    // POST: /api/chat/send
    [Authorize]
    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = Guid.Parse(userIdClaim!);

            var createdMessage = await _chatService.SendMessageAsync(userId, dto);
            return Ok(createdMessage);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}