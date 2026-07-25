using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Auth;

public class GoogleAuthDto
{
    [Required]
    public string IdToken { get; set; } = string.Empty; // Идентификационный токен от Google
}