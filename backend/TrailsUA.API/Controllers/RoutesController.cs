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
        [HttpGet]
        public IActionResult GetAll()
        {
            var routes = _routeService.GetAll();
            return Ok(routes);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var route = _routeService.GetById(id);
            if (route == null)
            {
                return NotFound(new { Message = "Маршрут не знайдено" });
            }
            return Ok(route);
        }
    }
}