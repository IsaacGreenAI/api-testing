using Microsoft.EntityFrameworkCore;
using UniverseService.Data;
using UniverseService.Interfaces;
using UniverseService.Models;

namespace UniverseService.Repositories;

/// <summary>
/// Repository implementation for Galaxy-specific operations
/// </summary>
public class GalaxyRepository : Repository<Galaxy>, IGalaxyRepository
{
    public GalaxyRepository(UniverseDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Galaxy>> GetByType(string type)
    {
        return await _dbSet
            .Where(g => g.Type.ToLower() == type.ToLower())
            .ToListAsync();
    }

    public async Task<IEnumerable<Galaxy>> GetWithBlackHole()
    {
        return await _dbSet
            .Where(g => g.HasBlackHole)
            .ToListAsync();
    }

    public async Task<IEnumerable<Galaxy>> GetWithinDistance(double maxDistance)
    {
        return await _dbSet
            .Where(g => g.DistanceFromEarth <= maxDistance)
            .OrderBy(g => g.DistanceFromEarth)
            .ToListAsync();
    }
}
