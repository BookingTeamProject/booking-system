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
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Регистрируем сервисы
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRouteService, RouteService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

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

// Важно: Порядок обязателен! Сначала UseAuthentication, затем UseAuthorization
app.UseAuthentication();
app.UseAuthorization();

// Подключаем маршруты контроллеров (включая AuthController)
app.MapControllers();

app.Run();