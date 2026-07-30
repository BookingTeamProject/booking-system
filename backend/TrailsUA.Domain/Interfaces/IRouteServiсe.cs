using TrailsUA.Domain.DTOs.Routes;

namespace TrailsUA.Domain.Interfaces;

public interface IRouteService
{
    Guid Create(CreateRouteDto dto);
}
