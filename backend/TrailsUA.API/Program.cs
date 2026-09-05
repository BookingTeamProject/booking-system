using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TrailsUA.API.Middleware;
using TrailsUA.Infrastructure.Data;
using TrailsUA.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Добавляем поддержку контроллеров
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Подключаем PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

var envPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
if (!string.IsNullOrEmpty(envPassword))
{
    var csBuilder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString)
    {
        Password = envPassword
    };
    connectionString = csBuilder.ConnectionString;
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Регистрируем сервисы
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRouteService, RouteService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();

// 4. Настраиваем JWT аутентификацию
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ошибка при автоматическом применении миграций базы данных.");
    }
}

app.UseStaticFiles();

app.UseCors("AllowAll");

// Подключение глобальной обработки ошибок
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Настройка Swagger для тестирования эндпоинтов в браузере
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

// AUTO SEEDING КАТЕГОРІЙ
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<TrailsUA.Infrastructure.Data.AppDbContext>();

        // Перевіряємо: якщо в базі немає категорій — створюємо всі 6 із Figma
        if (!context.Categories.Any())
        {
            var defaultCategories = new List<TrailsUA.Domain.Entities.Category>
            {
                new TrailsUA.Domain.Entities.Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Шале",
                    Description = "Традиційне альпійське шале серед гір",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TrailsUA.Domain.Entities.Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Котедж",
                    Description = "Дерев'яний гірський котедж для відпочинку",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TrailsUA.Domain.Entities.Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Будинок",
                    Description = "Цілий просторий будинок для всієї родини чи компанії",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TrailsUA.Domain.Entities.Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Квартира",
                    Description = "Затишні окремі апартаменти в центрі",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TrailsUA.Domain.Entities.Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Глемпінг",
                    Description = "Розкішні купольні намети просто неба з комфортом",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TrailsUA.Domain.Entities.Category
                {
                    Id = Guid.NewGuid(),
                    Name = "Кімната",
                    Description = "Окрема затишна кімната в гостьовому домі",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Categories.AddRange(defaultCategories);
            context.SaveChanges();
            Console.WriteLine("🌱 [Data Seeding] Успішно створено 6 базових категорій житла!");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ [Data Seeding Error]: {ex.Message}");
    }
}

app.Run();