namespace TrailsUA.Domain.Entities;

public class Comment : BaseEntity
{
    public string Text { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid RouteId { get; set; }
    public Route Route { get; set; } = null!;

    // Для древовидных ответов на комментарии
    public Guid? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
}