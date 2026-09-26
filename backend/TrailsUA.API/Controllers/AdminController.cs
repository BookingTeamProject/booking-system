using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.API.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin")]
public class AdminController(AppDbContext db, ILogger<AdminController> logger) : ControllerBase
{
    [HttpGet("users")]
    public async Task<IActionResult> Users([FromQuery] string? search, [FromQuery] UserRole? role,
        [FromQuery] string status = "active", [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page is < 1 or > 1000000 || pageSize is < 1 or > 100 || (role.HasValue && !Enum.IsDefined(role.Value)) ||
            status is not ("active" or "blocked" or "deleted" or "all"))
            return BadRequest(new { message = "Некоректні параметри пошуку." });
        var query = db.Users.AsNoTracking().AsQueryable();
        query = status switch {
            "active" => query.Where(u => !u.IsDeleted && !u.IsBlocked),
            "blocked" => query.Where(u => !u.IsDeleted && u.IsBlocked),
            "deleted" => query.Where(u => u.IsDeleted), _ => query };
        if (role.HasValue) query = query.Where(u => u.Role == role.Value);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            if (term.Length > 150) return BadRequest(new { message = "Пошуковий запит надто довгий." });
            query = query.Where(u => u.Email.ToLower().Contains(term) ||
                (u.FirstName + " " + u.LastName).ToLower().Contains(term) || u.Id.ToString() == term);
        }
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(u => u.CreatedAt).ThenBy(u => u.Id)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(u => new { u.Id, u.Email, u.FirstName, u.LastName, Role = u.Role.ToString(),
                u.CreatedAt, u.IsSystemAdmin, u.IsBlocked, u.IsDeleted }).ToListAsync();
        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> Statistics()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var month = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        return Ok(new {
            users = await db.Users.CountAsync(u => !u.IsDeleted),
            guests = await db.Users.CountAsync(u => !u.IsDeleted && u.Role == UserRole.User),
            hosts = await db.Users.CountAsync(u => !u.IsDeleted && u.Role == UserRole.Landlord),
            blocked = await db.Users.CountAsync(u => !u.IsDeleted && u.IsBlocked),
            deleted = await db.Users.CountAsync(u => u.IsDeleted),
            registeredThisMonth = await db.Users.CountAsync(u => !u.IsDeleted && u.CreatedAt >= month),
            properties = await db.Routes.CountAsync(),
            bookings = await db.Bookings.CountAsync(),
            activeBookings = await db.Bookings.CountAsync(b => b.CheckOut > today &&
                (b.Status == BookingStatus.Pending || b.Status == BookingStatus.Confirmed)),
            cancelledBookings = await db.Bookings.CountAsync(b => b.Status == BookingStatus.Cancelled),
            reviews = await db.Reviews.CountAsync()
        });
    }

    private async Task<(User? target, IActionResult? error)> Editable(Guid id, bool grantingAdmin = false)
    {
        var currentId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var current = await db.Users.SingleAsync(u => u.Id == currentId);
        var target = await db.Users.SingleOrDefaultAsync(u => u.Id == id);
        if (target == null) return (null, NotFound(new { message = "Користувача не знайдено." }));
        if (target.IsSystemAdmin || target.Id == currentId)
            return (null, Conflict(new { message = "Головний адміністратор та власний акаунт захищені від цих змін." }));
        if (!current.IsSystemAdmin && (target.Role == UserRole.Admin || grantingAdmin))
            return (null, StatusCode(403, new { message = "Керувати адміністраторами може лише головний адміністратор." }));
        return (target, null);
    }

    private async Task Save(User target, string action)
    {
        target.AuthVersion++;
        target.RefreshToken = null;
        target.RefreshTokenExpiryTime = null;
        target.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        logger.LogInformation("Admin {Actor} performed {Action} on account {Target}",
            User.FindFirstValue(ClaimTypes.NameIdentifier), action, target.Id);
    }

    [HttpPut("users/{id:guid}/role")]
    public async Task<IActionResult> Role(Guid id, [FromBody] UserRole role)
    {
        if (!Enum.IsDefined(role)) return BadRequest(new { message = "Невідома роль." });
        var (target, error) = await Editable(id, role == UserRole.Admin);
        if (error != null) return error;
        if (target!.IsDeleted) return Conflict(new { message = "Спочатку відновіть акаунт." });
        target.Role = role;
        await Save(target, "role:" + role);
        return NoContent();
    }

    [HttpPut("users/{id:guid}/blocked")]
    public async Task<IActionResult> Block(Guid id, [FromBody] bool blocked)
    {
        var (target, error) = await Editable(id);
        if (error != null) return error;
        if (target!.IsDeleted) return Conflict(new { message = "Спочатку відновіть акаунт." });
        target.IsBlocked = blocked;
        await Save(target, blocked ? "block" : "unblock");
        return NoContent();
    }

    [HttpDelete("users/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var (target, error) = await Editable(id);
        if (error != null) return error;
        // Logical deletion preserves booking, review and conversation history.
        target!.IsDeleted = true;
        await Save(target, "delete");
        return NoContent();
    }

    [HttpPost("users/{id:guid}/restore")]
    public async Task<IActionResult> Restore(Guid id)
    {
        var (target, error) = await Editable(id);
        if (error != null) return error;
        target!.IsDeleted = false;
        await Save(target, "restore");
        return NoContent();
    }
}
