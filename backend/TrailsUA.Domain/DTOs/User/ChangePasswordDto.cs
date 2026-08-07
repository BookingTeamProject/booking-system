using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.User;

public class ChangePasswordDto
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}