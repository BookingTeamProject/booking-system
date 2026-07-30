using Microsoft.AspNetCore.Mvc;
using TrailsUA.Domain.DTOs.Routes;
using TrailsUA.Domain.Interfaces;

namespace TrailsUA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase
    {
        private readonly IRouteService _routeService;
        public RoutesController(IRouteService routeService)
        {
            _routeService = routeService;
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateRouteDto dto)
        {
            var routeId = _routeService.Create(dto);
            return Ok(new { Id = routeId, Message = "Маршрут створено" });
        }
    }
}