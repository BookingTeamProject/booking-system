using TrailsUA.Domain.DTOs.Routes;
using TrailsUA.Domain.Entities;
using TrailsUA.Domain.Interfaces;
using TrailsUA.Infrastructure.Data;

namespace TrailsUA.Infrastructure.Services
{
    public class RouteService : IRouteService
    {
        private readonly AppDbContext _context;

        public RouteService(AppDbContext context)
        {
            _context = context;
        }

        public Guid Create(CreateRouteDto dto)
        {
            var newRoute = new Route
            {
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                DistanceKm = dto.DistanceKm,
                DurationHours = dto.DurationHours,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                AuthorId = Guid.Parse("11111111-2222-3333-4444-555555555555") // Заменить на ID пользователя(для авторов маршрутов)
            };

            _context.Routes.Add(newRoute);
            _context.SaveChanges();
            return newRoute.Id;
        }
        
        public List<Route> GetAll()
        {
            return _context.Routes.ToList();
    }
        public Route GetById(Guid id)
        {
            return _context.Routes.FirstOrDefault(r => r.Id == id);
        }
    }
}
