using UniverseService.Models;

namespace UniverseService.Interfaces;

/// <summary>
/// Repository interface for Planet-specific operations
/// </summary>
public interface IPlanetRepository : IRepository<Planet>
{
    /// <summary>
    /// Get planets by galaxy ID
    /// </summary>
    Task<IEnumerable<Planet>> GetByGalaxyId(int galaxyId);

    /// <summary>
    /// Get planets by type (e.g., Terrestrial, Gas Giant)
    /// </summary>
    Task<IEnumerable<Planet>> GetByType(string type);

    /// <summary>
    /// Get planets with atmosphere
    /// </summary>
    Task<IEnumerable<Planet>> GetWithAtmosphere();
}
