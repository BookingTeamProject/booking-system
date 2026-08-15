using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // Доступно ТОЛЬКО Администратору: Список всех пользователей
    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new { u.Id, u.Email, u.FirstName, u.LastName, Role = u.Role.ToString(), u.CreatedAt })
            .ToListAsync();
        return Ok(users);
    }

    // Доступно ТОЛЬКО Администратору: Смена роли пользователя
    [Authorize(Roles = "Admin")]
    [HttpPut("users/{userId:guid}/role")]
    public async Task<IActionResult> ChangeRole(Guid userId, [FromBody] UserRole newRole)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound(new { message = "Пользователь не найден" });

        user.Role = newRole;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Роль пользователя изменена на {newRole}" });
    }

    // Доступно Модератору и Админу: Панель проверки контента
    [Authorize(Roles = "Moderator,Admin")]
    [HttpGet("moderation/dashboard")]
    public IActionResult GetModerationDashboard()
    {
        return Ok(new { message = "Добро пожаловать в панель модерации Trails UA" });
    }
}