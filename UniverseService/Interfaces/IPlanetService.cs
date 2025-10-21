using UniverseService.Models;

namespace UniverseService.Interfaces;

/// <summary>
/// Service interface for Planet business logic
/// </summary>
public interface IPlanetService
{
    /// <summary>
    /// Get all planets
    /// </summary>
    Task<IEnumerable<Planet>> GetAll();

    /// <summary>
    /// Get planet by ID
    /// </summary>
    Task<Planet?> GetById(int id);

    /// <summary>
    /// Get planets by galaxy ID
    /// </summary>
    Task<IEnumerable<Planet>> GetByGalaxyId(int galaxyId);

    /// <summary>
    /// Get planets by type
    /// </summary>
    Task<IEnumerable<Planet>> GetByType(string type);

    /// <summary>
    /// Get planets with atmosphere
    /// </summary>
    Task<IEnumerable<Planet>> GetWithAtmosphere();

    /// <summary>
    /// Create a new planet
    /// </summary>
    Task<Planet> Create(Planet planet);

    /// <summary>
    /// Update an existing planet
    /// </summary>
    Task<Planet?> Update(int id, Planet planet);

    /// <summary>
    /// Delete a planet
    /// </summary>
    Task<bool> Delete(int id);

    /// <summary>
    /// Check if planet exists
    /// </summary>
    Task<bool> Exists(int id);
}
