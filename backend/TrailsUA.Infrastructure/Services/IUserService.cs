using Microsoft.AspNetCore.Http;
using TrailsUA.Domain.DTOs.Auth;
using TrailsUA.Domain.DTOs.User;

namespace TrailsUA.Infrastructure.Services;

public interface IUserService
{
    Task<UserInfoDto?> GetProfileAsync(Guid userId);
    Task<UserInfoDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
    Task<string> UploadAvatarAsync(Guid userId, IFormFile file);
}