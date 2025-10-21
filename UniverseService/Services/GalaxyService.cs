using UniverseService.Interfaces;
using UniverseService.Models;

namespace UniverseService.Services;

/// <summary>
/// Service for Galaxy business logic
/// </summary>
public class GalaxyService : IGalaxyService
{
    private readonly IGalaxyRepository _galaxyRepository;
    private readonly ILogger<GalaxyService> _logger;

    public GalaxyService(IGalaxyRepository galaxyRepository, ILogger<GalaxyService> logger)
    {
        _galaxyRepository = galaxyRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<Galaxy>> GetAll()
    {
        _logger.LogInformation("Service: Getting all galaxies");
        return await _galaxyRepository.GetAll();
    }

    public async Task<Galaxy?> GetById(int id)
    {
        _logger.LogInformation("Service: Getting galaxy with ID: {Id}", id);
        return await _galaxyRepository.GetById(id);
    }

    public async Task<IEnumerable<Galaxy>> GetByType(string type)
    {
        _logger.LogInformation("Service: Getting galaxies of type: {Type}", type);
        return await _galaxyRepository.GetByType(type);
    }

    public async Task<IEnumerable<Galaxy>> GetWithBlackHole()
    {
        _logger.LogInformation("Service: Getting galaxies with black holes");
        return await _galaxyRepository.GetWithBlackHole();
    }

    public async Task<IEnumerable<Galaxy>> GetWithinDistance(double maxDistance)
    {
        _logger.LogInformation("Service: Getting galaxies within {MaxDistance} light years", maxDistance);
        return await _galaxyRepository.GetWithinDistance(maxDistance);
    }

    public async Task<Galaxy> Create(Galaxy galaxy)
    {
        _logger.LogInformation("Service: Creating galaxy: {Name}", galaxy.Name);

        // Business logic can go here
        // Example: Validate galaxy doesn't already exist by name
        // Example: Validate StarCount is positive
        // Example: Send notifications

        return await _galaxyRepository.Add(galaxy);
    }

    public async Task<Galaxy?> Update(int id, Galaxy galaxy)
    {
        _logger.LogInformation("Service: Updating galaxy with ID: {Id}", id);

        var exists = await _galaxyRepository.Exists(id);
        if (!exists)
        {
            _logger.LogWarning("Service: Galaxy with ID: {Id} not found", id);
            return null;
        }

        // Business logic can go here
        // Example: Validate updates don't violate business rules
        // Example: Audit trail logging

        return await _galaxyRepository.Update(galaxy);
    }

    public async Task<bool> Delete(int id)
    {
        _logger.LogInformation("Service: Deleting galaxy with ID: {Id}", id);

        // Business logic can go here
        // Example: Check if galaxy has planets before deletion
        // Example: Cascade delete related entities

        return await _galaxyRepository.Delete(id);
    }

    public async Task<bool> Exists(int id)
    {
        return await _galaxyRepository.Exists(id);
    }
}
