using TrailsUA.Domain.DTOs.Auth;

namespace TrailsUA.Infrastructure.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> GoogleAuthAsync(GoogleAuthDto dto);
    Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto dto);
    Task<bool> LogoutAsync(Guid userId);
}