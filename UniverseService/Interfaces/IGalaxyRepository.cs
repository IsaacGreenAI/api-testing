using UniverseService.Models;

namespace UniverseService.Interfaces;

/// <summary>
/// Repository interface for Galaxy-specific operations
/// </summary>
public interface IGalaxyRepository : IRepository<Galaxy>
{
    /// <summary>
    /// Get galaxies by type (e.g., Spiral, Elliptical, Irregular)
    /// </summary>
    Task<IEnumerable<Galaxy>> GetByType(string type);

    /// <summary>
    /// Get galaxies with black holes
    /// </summary>
    Task<IEnumerable<Galaxy>> GetWithBlackHole();

    /// <summary>
    /// Get galaxies within a certain distance from Earth (in light years)
    /// </summary>
    Task<IEnumerable<Galaxy>> GetWithinDistance(double maxDistance);
}
