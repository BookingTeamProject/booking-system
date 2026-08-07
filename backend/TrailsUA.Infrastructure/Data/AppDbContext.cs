using Microsoft.EntityFrameworkCore;
using TrailsUA.Domain.Entities;

namespace TrailsUA.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Route> Routes => Set<Route>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Image> Images => Set<Image>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Настройка составного ключа для Избранного (Favorite)
        modelBuilder.Entity<Favorite>()
            .HasKey(f => new { f.UserId, f.RouteId });

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Route)
            .WithMany(r => r.Favorites)
            .HasForeignKey(f => f.RouteId)
            .OnDelete(DeleteBehavior.Cascade);

        // 2. Уникальный Email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // 3. Отмена каскадного удаления для отзывов и комментариев
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Route)
            .WithMany(rt => rt.Reviews)
            .HasForeignKey(r => r.RouteId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Route)
            .WithMany(rt => rt.Comments)
            .HasForeignKey(c => c.RouteId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}