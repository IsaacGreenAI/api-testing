using Microsoft.AspNetCore.Mvc;
using UniverseService.Interfaces;
using UniverseService.Models;

namespace UniverseService.Controllers;

/// <summary>
/// Controller for managing planets
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PlanetsController : ControllerBase
{
    private readonly IPlanetService _planetService;
    private readonly ILogger<PlanetsController> _logger;

    public PlanetsController(IPlanetService planetService, ILogger<PlanetsController> logger)
    {
        _planetService = planetService;
        _logger = logger;
    }

    /// <summary>
    /// Get all planets
    /// </summary>
    /// <returns>List of all planets</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Planet>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Planet>>> GetAll()
    {
        _logger.LogInformation("Getting all planets");
        var planets = await _planetService.GetAll();
        return Ok(planets);
    }

    /// <summary>
    /// Get a specific planet by ID
    /// </summary>
    /// <param name="id">Planet ID</param>
    /// <returns>Planet details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Planet), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Planet>> GetById(int id)
    {
        _logger.LogInformation("Getting planet with ID: {Id}", id);
        var planet = await _planetService.GetById(id);

        if (planet == null)
        {
            _logger.LogWarning("Planet with ID: {Id} not found", id);
            return NotFound(new { message = $"Planet with ID {id} not found" });
        }

        return Ok(planet);
    }

    /// <summary>
    /// Get planets by galaxy ID
    /// </summary>
    /// <param name="galaxyId">Galaxy ID</param>
    /// <returns>List of planets in the specified galaxy</returns>
    [HttpGet("galaxy/{galaxyId}")]
    [ProducesResponseType(typeof(IEnumerable<Planet>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Planet>>> GetByGalaxyId(int galaxyId)
    {
        _logger.LogInformation("Getting planets in galaxy: {GalaxyId}", galaxyId);
        var planets = await _planetService.GetByGalaxyId(galaxyId);
        return Ok(planets);
    }

    /// <summary>
    /// Get planets by type
    /// </summary>
    /// <param name="type">Planet type (e.g., Terrestrial, Gas Giant, Ice Giant)</param>
    /// <returns>List of planets of the specified type</returns>
    [HttpGet("type/{type}")]
    [ProducesResponseType(typeof(IEnumerable<Planet>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Planet>>> GetByType(string type)
    {
        _logger.LogInformation("Getting planets of type: {Type}", type);
        var planets = await _planetService.GetByType(type);
        return Ok(planets);
    }

    /// <summary>
    /// Get planets with atmosphere
    /// </summary>
    /// <returns>List of planets that have an atmosphere</returns>
    [HttpGet("with-atmosphere")]
    [ProducesResponseType(typeof(IEnumerable<Planet>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Planet>>> GetWithAtmosphere()
    {
        _logger.LogInformation("Getting planets with atmosphere");
        var planets = await _planetService.GetWithAtmosphere();
        return Ok(planets);
    }

    /// <summary>
    /// Create a new planet
    /// </summary>
    /// <param name="planet">Planet data</param>
    /// <returns>Created planet</returns>
    [HttpPost]
    [ProducesResponseType(typeof(Planet), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Planet>> Create([FromBody] Planet planet)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _logger.LogInformation("Creating new planet: {Name}", planet.Name);
        var createdPlanet = await _planetService.Create(planet);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdPlanet.Id },
            createdPlanet);
    }

    /// <summary>
    /// Update an existing planet
    /// </summary>
    /// <param name="id">Planet ID</param>
    /// <param name="planet">Updated planet data</param>
    /// <returns>Updated planet</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Planet), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Planet>> Update(int id, [FromBody] Planet planet)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != planet.Id)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        _logger.LogInformation("Updating planet with ID: {Id}", id);
        var updatedPlanet = await _planetService.Update(id, planet);

        if (updatedPlanet == null)
        {
            _logger.LogWarning("Planet with ID: {Id} not found for update", id);
            return NotFound(new { message = $"Planet with ID {id} not found" });
        }

        return Ok(updatedPlanet);
    }

    /// <summary>
    /// Delete a planet
    /// </summary>
    /// <param name="id">Planet ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Deleting planet with ID: {Id}", id);
        var deleted = await _planetService.Delete(id);

        if (!deleted)
        {
            _logger.LogWarning("Planet with ID: {Id} not found for deletion", id);
            return NotFound(new { message = $"Planet with ID {id} not found" });
        }

        return NoContent();
    }
}
