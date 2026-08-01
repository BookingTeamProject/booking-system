using TrailsUA.Domain.DTOs.Routes;
using TrailsUA.Domain.Entities;

namespace TrailsUA.Domain.Interfaces;

public interface IRouteService
{
    Guid Create(CreateRouteDto dto);
    List<Route> GetAll();
    Route GetById(Guid id);
}
