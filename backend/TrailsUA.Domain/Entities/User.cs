using System.Xml.Linq;

namespace TrailsUA.Domain.Entities;

public enum UserRole
{
    User = 0,       // Арендатор / Турист
    Landlord = 1,   // Арендодатель
    Admin = 2       // Администратор
}

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // Пустая строка если регистрация через Google
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? AvatarUrl { get; set; }

    // Поле для входа через Google
    public string? GoogleId { get; set; }

    public UserRole Role { get; set; } = UserRole.User;

    // Refresh Token для авторизации
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // Связи (Navigation Properties)
    public ICollection<Route> Routes { get; set; } = new List<Route>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}