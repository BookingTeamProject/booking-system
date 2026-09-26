using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TrailsUA.Domain.DTOs.Auth;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.Tests;

public class PhoneAuthTests
{
    [Fact]
    public async Task PhoneRegistrationSupportsBothLoginsAndRejectsDuplicates()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
        await db.Database.EnsureCreatedAsync();
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?> {
            ["JwtSettings:SecretKey"] = "phone-test-secret-at-least-sixty-four-characters-long-1234567890123456",
            ["JwtSettings:RefreshTokenExpirationDays"] = "7"
        }).Build();
        var auth = new AuthService(db, config);
        var result = await auth.RegisterAsync(new RegisterDto { Email="phone@example.test", Password="test-password",
            FirstName="Test", LastName="Phone", PhoneNumber="+380 (67) 123-45-67" });
        Assert.Equal("+380671234567", result.User.PhoneNumber);
        Assert.Equal(result.User.Id, (await auth.LoginAsync(new LoginDto { PhoneNumber="+380671234567", Password="test-password" })).User.Id);
        Assert.Equal(result.User.Id, (await auth.LoginAsync(new LoginDto { Email="phone@example.test", Password="test-password" })).User.Id);
        await Assert.ThrowsAsync<ArgumentException>(() => auth.RegisterAsync(new RegisterDto { Email="other@example.test", Password="test-password", PhoneNumber="+380671234567" }));
        await Assert.ThrowsAsync<ArgumentException>(() => auth.LoginAsync(new LoginDto { Password="test-password" }));
        await Assert.ThrowsAsync<ArgumentException>(() => auth.LoginAsync(new LoginDto { Email="phone@example.test", PhoneNumber="+380671234567", Password="test-password" }));
        await Assert.ThrowsAsync<Exception>(() => auth.LoginAsync(new LoginDto { PhoneNumber="+380671234567", Password="wrong-password" }));
    }

    [Theory]
    [InlineData("0671234567")]
    [InlineData("+38012abc567")]
    [InlineData("+012345678")]
    public void InvalidInternationalPhoneIsRejected(string phone) =>
        Assert.Throws<ArgumentException>(() => PhoneNumberFormat.Normalize(phone));
}
