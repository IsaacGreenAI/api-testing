using UniverseService.Interfaces;
using UniverseService.Models;

namespace UniverseService.Services;

/// <summary>
/// Service for Planet business logic
/// </summary>
public class PlanetService : IPlanetService
{
    private readonly IPlanetRepository _planetRepository;
    private readonly ILogger<PlanetService> _logger;

    public PlanetService(IPlanetRepository planetRepository, ILogger<PlanetService> logger)
    {
        _planetRepository = planetRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<Planet>> GetAll()
    {
        _logger.LogInformation("Service: Getting all planets");
        return await _planetRepository.GetAll();
    }

    public async Task<Planet?> GetById(int id)
    {
        _logger.LogInformation("Service: Getting planet with ID: {Id}", id);
        return await _planetRepository.GetById(id);
    }

    public async Task<IEnumerable<Planet>> GetByGalaxyId(int galaxyId)
    {
        _logger.LogInformation("Service: Getting planets in galaxy: {GalaxyId}", galaxyId);
        return await _planetRepository.GetByGalaxyId(galaxyId);
    }

    public async Task<IEnumerable<Planet>> GetByType(string type)
    {
        _logger.LogInformation("Service: Getting planets of type: {Type}", type);
        return await _planetRepository.GetByType(type);
    }

    public async Task<IEnumerable<Planet>> GetWithAtmosphere()
    {
        _logger.LogInformation("Service: Getting planets with atmosphere");
        return await _planetRepository.GetWithAtmosphere();
    }

    public async Task<Planet> Create(Planet planet)
    {
        _logger.LogInformation("Service: Creating planet: {Name}", planet.Name);

        // Business logic can go here
        // Example: Validate planet doesn't already exist by name
        // Example: Validate galaxy exists if GalaxyId is provided

        return await _planetRepository.Add(planet);
    }

    public async Task<Planet?> Update(int id, Planet planet)
    {
        _logger.LogInformation("Service: Updating planet with ID: {Id}", id);

        var exists = await _planetRepository.Exists(id);
        if (!exists)
        {
            _logger.LogWarning("Service: Planet with ID: {Id} not found", id);
            return null;
        }

        // Business logic can go here
        // Example: Validate updates don't violate business rules

        return await _planetRepository.Update(planet);
    }

    public async Task<bool> Delete(int id)
    {
        _logger.LogInformation("Service: Deleting planet with ID: {Id}", id);

        // Business logic can go here
        // Example: Check if planet can be deleted (no dependencies)

        return await _planetRepository.Delete(id);
    }

    public async Task<bool> Exists(int id)
    {
        return await _planetRepository.Exists(id);
    }
}
