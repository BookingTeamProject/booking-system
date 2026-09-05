using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace TrailsUA.Domain.Entities;

public class Route : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty; // Например: "Карпаты, Яремче"
    public decimal? Price { get; set; }                  // Цена (если это платный тур или аренда)

    // Связь с автором (Арендодателем)
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    // Связь с категорией
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // Связи
    public ICollection<Image> Images { get; set; } = new List<Image>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}