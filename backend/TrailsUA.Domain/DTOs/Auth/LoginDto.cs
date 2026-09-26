using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Auth;

public class LoginDto
{
    [EmailAddress]
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

    [Required]
    public string Password { get; set; } = string.Empty;
}
