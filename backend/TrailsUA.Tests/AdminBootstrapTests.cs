using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TrailsUA.Domain.Entities;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Infrastructure.Services;

namespace TrailsUA.Tests;

public class AdminBootstrapTests
{
    private static IConfiguration Config(string email, string password) => new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?> {
            ["BootstrapAdmin:Email"] = email, ["BootstrapAdmin:Password"] = password
        }).Build();

    [Fact]
    public async Task RestartDoesNotResetRootPasswordOrCreateAnotherRoot()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
        await db.Database.EnsureCreatedAsync();
        await AdminBootstrap.EnsureAsync(db, Config(" ROOT@example.test ", "original-password"));
        await AdminBootstrap.EnsureAsync(db, Config("other@example.test", "replacement-password"));
        var root = await db.Users.SingleAsync();
        Assert.Equal("root@example.test", root.Email);
        Assert.True(root.IsSystemAdmin);
        Assert.Equal(UserRole.Admin, root.Role);
        Assert.True(BCrypt.Net.BCrypt.Verify("original-password", root.PasswordHash));
        Assert.False(BCrypt.Net.BCrypt.Verify("replacement-password", root.PasswordHash));
    }

    [Fact]
    public async Task ExistingAccountIsNeverAutomaticallyPromoted()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var db = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options);
        await db.Database.EnsureCreatedAsync();
        db.Users.Add(new User { Email = "root@example.test" });
        await db.SaveChangesAsync();
        await Assert.ThrowsAsync<InvalidOperationException>(() => AdminBootstrap.EnsureAsync(db, Config("root@example.test", "valid-test-password")));
        Assert.False((await db.Users.SingleAsync()).IsSystemAdmin);
    }
}
