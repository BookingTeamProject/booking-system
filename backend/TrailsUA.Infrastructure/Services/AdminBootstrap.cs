using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services;

public static class AdminBootstrap
{
    public static async Task EnsureAsync(AppDbContext db, IConfiguration configuration)
    {
        // Never reset an existing administrator's password on restart.
        if (await db.Users.AnyAsync(u => u.IsSystemAdmin)) return;
        var email = configuration["BootstrapAdmin:Email"]?.Trim().ToLowerInvariant();
        var password = configuration["BootstrapAdmin:Password"];
        if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(password)) return;
        if (string.IsNullOrEmpty(email) || !new EmailAddressAttribute().IsValid(email) ||
            string.IsNullOrEmpty(password) || password.Length < 12 || System.Text.Encoding.UTF8.GetByteCount(password) > 72)
            throw new InvalidOperationException("BootstrapAdmin requires a valid email and a password of at least 12 characters (maximum 72 UTF-8 bytes).");
        if (await db.Users.AnyAsync(u => u.Email == email))
            throw new InvalidOperationException("Bootstrap administrator email already belongs to an account. Use a separate email; automatic promotion is forbidden.");
        db.Users.Add(new User { Email = email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            FirstName = "System", LastName = "Administrator", Role = UserRole.Admin, IsSystemAdmin = true });
        await db.SaveChangesAsync();
    }
}
