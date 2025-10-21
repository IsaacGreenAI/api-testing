using Microsoft.AspNetCore.Mvc;
using UniverseService.Interfaces;
using UniverseService.Models;

namespace UniverseService.Controllers;

/// <summary>
/// Controller for managing galaxies
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class GalaxiesController : ControllerBase
{
    private readonly IGalaxyService _galaxyService;
    private readonly ILogger<GalaxiesController> _logger;

    public GalaxiesController(IGalaxyService galaxyService, ILogger<GalaxiesController> logger)
    {
        _galaxyService = galaxyService;
        _logger = logger;
    }

    /// <summary>
    /// Get all galaxies
    /// </summary>
    /// <returns>List of all galaxies</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Galaxy>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Galaxy>>> GetAll()
    {
        _logger.LogInformation("Getting all galaxies");
        var galaxies = await _galaxyService.GetAll();
        return Ok(galaxies);
    }

    /// <summary>
    /// Get a specific galaxy by ID
    /// </summary>
    /// <param name="id">Galaxy ID</param>
    /// <returns>Galaxy details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Galaxy), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Galaxy>> GetById(int id)
    {
        _logger.LogInformation("Getting galaxy with ID: {Id}", id);
        var galaxy = await _galaxyService.GetById(id);

        if (galaxy == null)
        {
            _logger.LogWarning("Galaxy with ID: {Id} not found", id);
            return NotFound(new { message = $"Galaxy with ID {id} not found" });
        }

        return Ok(galaxy);
    }

    /// <summary>
    /// Get galaxies by type
    /// </summary>
    /// <param name="type">Galaxy type (e.g., Spiral, Elliptical, Irregular)</param>
    /// <returns>List of galaxies of the specified type</returns>
    [HttpGet("type/{type}")]
    [ProducesResponseType(typeof(IEnumerable<Galaxy>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Galaxy>>> GetByType(string type)
    {
        _logger.LogInformation("Getting galaxies of type: {Type}", type);
        var galaxies = await _galaxyService.GetByType(type);
        return Ok(galaxies);
    }

    /// <summary>
    /// Get galaxies with black holes
    /// </summary>
    /// <returns>List of galaxies that contain black holes</returns>
    [HttpGet("with-blackhole")]
    [ProducesResponseType(typeof(IEnumerable<Galaxy>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Galaxy>>> GetWithBlackHole()
    {
        _logger.LogInformation("Getting galaxies with black holes");
        var galaxies = await _galaxyService.GetWithBlackHole();
        return Ok(galaxies);
    }

    /// <summary>
    /// Get galaxies within a certain distance from Earth
    /// </summary>
    /// <param name="maxDistance">Maximum distance in light years</param>
    /// <returns>List of galaxies within the specified distance</returns>
    [HttpGet("within-distance/{maxDistance}")]
    [ProducesResponseType(typeof(IEnumerable<Galaxy>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Galaxy>>> GetWithinDistance(double maxDistance)
    {
        _logger.LogInformation("Getting galaxies within {MaxDistance} light years", maxDistance);
        var galaxies = await _galaxyService.GetWithinDistance(maxDistance);
        return Ok(galaxies);
    }

    /// <summary>
    /// Create a new galaxy
    /// </summary>
    /// <param name="galaxy">Galaxy data</param>
    /// <returns>Created galaxy</returns>
    [HttpPost]
    [ProducesResponseType(typeof(Galaxy), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Galaxy>> Create([FromBody] Galaxy galaxy)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _logger.LogInformation("Creating new galaxy: {Name}", galaxy.Name);
        var createdGalaxy = await _galaxyService.Create(galaxy);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdGalaxy.Id },
            createdGalaxy);
    }

    /// <summary>
    /// Update an existing galaxy
    /// </summary>
    /// <param name="id">Galaxy ID</param>
    /// <param name="galaxy">Updated galaxy data</param>
    /// <returns>Updated galaxy</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Galaxy), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Galaxy>> Update(int id, [FromBody] Galaxy galaxy)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != galaxy.Id)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        _logger.LogInformation("Updating galaxy with ID: {Id}", id);
        var updatedGalaxy = await _galaxyService.Update(id, galaxy);

        if (updatedGalaxy == null)
        {
            _logger.LogWarning("Galaxy with ID: {Id} not found for update", id);
            return NotFound(new { message = $"Galaxy with ID {id} not found" });
        }

        return Ok(updatedGalaxy);
    }

    /// <summary>
    /// Delete a galaxy
    /// </summary>
    /// <param name="id">Galaxy ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Deleting galaxy with ID: {Id}", id);
        var deleted = await _galaxyService.Delete(id);

        if (!deleted)
        {
            _logger.LogWarning("Galaxy with ID: {Id} not found for deletion", id);
            return NotFound(new { message = $"Galaxy with ID {id} not found" });
        }

        return NoContent();
    }
}
