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
            };

            _context.Routes.Add(newRoute);
            _context.SaveChanges();
            return newRoute.Id;
        }
    }
}
