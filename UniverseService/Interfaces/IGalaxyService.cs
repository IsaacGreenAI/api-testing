using UniverseService.Models;

namespace UniverseService.Interfaces;

/// <summary>
/// Service interface for Galaxy business logic
/// </summary>
public interface IGalaxyService
{
    /// <summary>
    /// Get all galaxies
    /// </summary>
    Task<IEnumerable<Galaxy>> GetAll();

    /// <summary>
    /// Get galaxy by ID
    /// </summary>
    Task<Galaxy?> GetById(int id);

    /// <summary>
    /// Get galaxies by type
    /// </summary>
    Task<IEnumerable<Galaxy>> GetByType(string type);

    /// <summary>
    /// Get galaxies with black holes
    /// </summary>
    Task<IEnumerable<Galaxy>> GetWithBlackHole();

    /// <summary>
    /// Get galaxies within a certain distance
    /// </summary>
    Task<IEnumerable<Galaxy>> GetWithinDistance(double maxDistance);

    /// <summary>
    /// Create a new galaxy
    /// </summary>
    Task<Galaxy> Create(Galaxy galaxy);

    /// <summary>
    /// Update an existing galaxy
    /// </summary>
    Task<Galaxy?> Update(int id, Galaxy galaxy);

    /// <summary>
    /// Delete a galaxy
    /// </summary>
    Task<bool> Delete(int id);

    /// <summary>
    /// Check if galaxy exists
    /// </summary>
    Task<bool> Exists(int id);
}
