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
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Route>().Property(r => r.MaxGuests).HasDefaultValue(4);
        modelBuilder.Entity<Booking>(b =>
        {
            b.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            b.Property(x => x.CancellationReason).HasMaxLength(1000);
            b.Property(x => x.PricePerNight).HasPrecision(12, 2);
            b.Property(x => x.CleaningFee).HasPrecision(12, 2);
            b.Property(x => x.ServiceFee).HasPrecision(12, 2);
            b.Property(x => x.TotalPrice).HasPrecision(12, 2);
            b.HasOne(x => x.Route).WithMany().HasForeignKey(x => x.RouteId).OnDelete(DeleteBehavior.Restrict);
            b.HasOne(x => x.Guest).WithMany().HasForeignKey(x => x.GuestId).OnDelete(DeleteBehavior.Restrict);
            b.HasIndex(x => new { x.RouteId, x.CheckIn, x.CheckOut });
            b.ToTable(t =>
            {
                t.HasCheckConstraint("CK_Bookings_Dates", "\"CheckOut\" > \"CheckIn\"");
                t.HasCheckConstraint("CK_Bookings_Guests", "\"Guests\" > 0");
                t.HasCheckConstraint("CK_Bookings_TotalPrice", "\"TotalPrice\" > 0");
            });
        });

        modelBuilder.Entity<User>().HasIndex(u => u.IsSystemAdmin).IsUnique().HasFilter("\"IsSystemAdmin\" = true");

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

        modelBuilder.Entity<ChatMessage>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
