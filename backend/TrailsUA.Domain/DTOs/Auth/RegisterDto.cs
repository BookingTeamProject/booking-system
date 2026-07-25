using System.ComponentModel.DataAnnotations;
using TrailsUA.Domain.Entities;

namespace TrailsUA.Domain.DTOs.Auth;

public class RegisterDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    // Роль: User (0) или Landlord (1)
    public UserRole Role { get; set; } = UserRole.User;
}