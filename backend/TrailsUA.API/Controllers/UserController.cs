using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrailsUA.Domain.DTOs.User;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // GET /api/user/me — Профиль пользователя
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();
        var profile = await _userService.GetProfileAsync(userId);
        if (profile == null) return NotFound(new { message = "Пользователь не найден" });
        return Ok(profile);
    }

    // PUT /api/user/profile — Редактирование профиля
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = GetCurrentUserId();
        var updated = await _userService.UpdateProfileAsync(userId, dto);
        return Ok(updated);
    }

    // POST /api/user/become-landlord — Стати орендодавцем та одразу отримати новий токен
    [HttpPost("become-landlord")]
    public async Task<IActionResult> BecomeLandlord(
        [FromServices] AppDbContext context,
        [FromServices] IAuthService authService)
    {
        var userId = GetCurrentUserId();
        var user = await context.Users.FindAsync(userId);
        if (user == null)
            return NotFound(new { message = "Користувача не знайдено" });

        // 1. Оновлюємо роль у базі даних
        user.Role = UserRole.Landlord;
        await context.SaveChangesAsync();

        // 2. Оновлюємо JWT-токен через сервіс авторизації
        try
        {
            var tokens = await authService.RefreshTokenAsync(new TrailsUA.Domain.DTOs.Auth.RefreshTokenDto
            {
                RefreshToken = user.RefreshToken ?? ""
            });

            return Ok(new
            {
                accessToken = tokens.AccessToken,
                refreshToken = tokens.RefreshToken,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    Role = "Landlord",
                    user.AvatarUrl
                },
                message = "Вітаємо! Ви успішно стали орендодавцем."
            });
        }
        catch
        {
            // Якщо токени з якоїсь причини не згенерувалися, роль у базі все одно вже збережена
            return Ok(new { message = "Роль успішно оновлено на Landlord" });
        }
    }

    // POST /api/user/change-password — Смена пароля
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _userService.ChangePasswordAsync(userId, dto);
            return Ok(new { message = "Пароль успешно изменён" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST /api/user/avatar — Загрузка аватара
    [HttpPost("avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        try
        {
            var userId = GetCurrentUserId();
            var avatarUrl = await _userService.UploadAvatarAsync(userId, file);
            return Ok(new { avatarUrl, message = "Аватар успешно обновлён" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(claim!);
    }
}