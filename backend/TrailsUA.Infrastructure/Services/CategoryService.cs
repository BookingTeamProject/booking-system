using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TrailsUA.Domain.DTOs.Category;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Domain.Entities;

namespace TrailsUA.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;
    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _context.Categories.ToListAsync();

        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            IconUrl = c.IconUrl
        }).ToList();
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(Guid id)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            IconUrl = category.IconUrl
        };
    }
    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description,
            IconUrl = dto.IconUrl
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            IconUrl = category.IconUrl
        };
    }
    public async Task<CategoryDto?> UpdateCategoryAsync(Guid id, UpdateCategoryDto dto)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return null;

        category.Name = dto.Name;
        category.Description = dto.Description;
        category.IconUrl = dto.IconUrl;

        await _context.SaveChangesAsync();
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            IconUrl = category.IconUrl
        };
    }
    public async Task<bool> DeleteCategoryAsync(Guid id)
    {
        var category = await _context.Categories
            .Include(c => c.Routes)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return false;

        if (category.Routes.Any())

            throw new InvalidOperationException("Не можна видалити категорію в якій є маршрути");
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}