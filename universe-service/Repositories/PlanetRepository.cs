using Microsoft.EntityFrameworkCore;
using UniverseService.Data;
using UniverseService.Interfaces;
using UniverseService.Models;

namespace UniverseService.Repositories;

/// <summary>
/// Repository implementation for Planet-specific operations
/// </summary>
public class PlanetRepository : Repository<Planet>, IPlanetRepository
{
    public PlanetRepository(UniverseDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Planet>> GetByGalaxyId(int galaxyId)
    {
        return await _dbSet
            .Where(p => p.GalaxyId == galaxyId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Planet>> GetByType(string type)
    {
        return await _dbSet
            .Where(p => p.Type.ToLower() == type.ToLower())
            .ToListAsync();
    }

    public async Task<IEnumerable<Planet>> GetWithAtmosphere()
    {
        return await _dbSet
            .Where(p => p.HasAtmosphere)
            .ToListAsync();
    }
}
