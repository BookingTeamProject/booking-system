using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Auth;

public class RefreshTokenDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}