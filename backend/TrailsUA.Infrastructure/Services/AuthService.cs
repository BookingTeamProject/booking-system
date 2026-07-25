using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TrailsUA.Domain.DTOs.Auth;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email.ToLower()))
        {
            throw new Exception("Пользователь с таким Email уже существует");
        }

        var user = new User
        {
            Email = dto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());
        if (user == null || string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new Exception("Неверный Email или пароль");
        }

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDto> GoogleAuthAsync(GoogleAuthDto dto)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken);
        }
        catch
        {
            throw new Exception("Невалидный токен Google");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email.ToLower());

        if (user == null)
        {
            // Автоматическая регистрация нового пользователя через Google
            user = new User
            {
                Email = payload.Email.ToLower(),
                FirstName = payload.GivenName ?? "User",
                LastName = payload.FamilyName ?? "",
                AvatarUrl = payload.Picture,
                GoogleId = payload.Subject,
                Role = UserRole.User
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == dto.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new Exception("Невалидный или просроченный Refresh Token");
        }

        return await GenerateAuthResponseAsync(user);
    }

    public async Task<bool> LogoutAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await _context.SaveChangesAsync();

        return true;
    }

    // Генерация пачки Access + Refresh токены
    private async Task<AuthResponseDto> GenerateAuthResponseAsync(User user)
    {
        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
            int.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"] ?? "7"));

        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            RefreshTokenExpiration = user.RefreshTokenExpiryTime.Value,
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role.ToString(),
                AvatarUrl = user.AvatarUrl
            }
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["AccessTokenExpirationMinutes"] ?? "15")),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}