using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Domain.DTOs.Category;

namespace TrailsUA.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;
    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<CategoryDto>> GetAllCategoriesAsync()
    {
        throw new NotImplementedException();
    }

    public Task<CategoryDto?> GetCategoryByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        throw new NotImplementedException();
    }

    public Task<CategoryDto?> UpdateCategoryAsync(Guid id, UpdateCategoryDto dto)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteCategoryAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}
