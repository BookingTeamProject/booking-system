using System.ComponentModel.DataAnnotations;

namespace TrailsUA.Domain.DTOs.Category;

public class UpdateCategoryDto
{
    [Required(ErrorMessage = "Обов'язкова назва категорії")]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
}