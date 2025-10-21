using Microsoft.EntityFrameworkCore;
using UniverseService.Models;

namespace UniverseService.Data;

/// <summary>
/// Database context for the Universe service
/// </summary>
public class UniverseDbContext : DbContext
{
    public UniverseDbContext(DbContextOptions<UniverseDbContext> options) : base(options)
    {
    }

    /// <summary>
    /// Planets in the universe
    /// </summary>
    public DbSet<Planet> Planets { get; set; }

    /// <summary>
    /// Galaxies in the universe
    /// </summary>
    public DbSet<Galaxy> Galaxies { get; set; }

    /// <summary>
    /// Configure entity relationships and seed data
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Planet entity
        modelBuilder.Entity<Planet>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Configure Galaxy entity
        modelBuilder.Entity<Galaxy>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Seed Galaxies
        modelBuilder.Entity<Galaxy>().HasData(
            new Galaxy
            {
                Id = 1,
                Name = "Milky Way",
                Type = "Spiral",
                StarCount = 400,
                DistanceFromEarth = 0,
                Diameter = 105700,
                HasBlackHole = true
            },
            new Galaxy
            {
                Id = 2,
                Name = "Andromeda",
                Type = "Spiral",
                StarCount = 1000,
                DistanceFromEarth = 2537000,
                Diameter = 220000,
                HasBlackHole = true
            },
            new Galaxy
            {
                Id = 3,
                Name = "Triangulum",
                Type = "Spiral",
                StarCount = 40,
                DistanceFromEarth = 3000000,
                Diameter = 60000,
                HasBlackHole = false
            },
            new Galaxy
            {
                Id = 4,
                Name = "Large Magellanic Cloud",
                Type = "Irregular",
                StarCount = 30,
                DistanceFromEarth = 163000,
                Diameter = 14000,
                HasBlackHole = false
            },
            new Galaxy
            {
                Id = 5,
                Name = "Sombrero Galaxy",
                Type = "Elliptical",
                StarCount = 800,
                DistanceFromEarth = 29350000,
                Diameter = 50000,
                HasBlackHole = true
            }
        );

        // Seed Planets (Solar System)
        modelBuilder.Entity<Planet>().HasData(
            new Planet
            {
                Id = 1,
                Name = "Mercury",
                Type = "Terrestrial",
                Mass = 0.055,
                Radius = 2439.7,
                DistanceFromStar = 0.39,
                GalaxyId = 1,
                HasAtmosphere = false
            },
            new Planet
            {
                Id = 2,
                Name = "Venus",
                Type = "Terrestrial",
                Mass = 0.815,
                Radius = 6051.8,
                DistanceFromStar = 0.72,
                GalaxyId = 1,
                HasAtmosphere = true
            },
            new Planet
            {
                Id = 3,
                Name = "Earth",
                Type = "Terrestrial",
                Mass = 1.0,
                Radius = 6371.0,
                DistanceFromStar = 1.0,
                GalaxyId = 1,
                HasAtmosphere = true
            },
            new Planet
            {
                Id = 4,
                Name = "Mars",
                Type = "Terrestrial",
                Mass = 0.107,
                Radius = 3389.5,
                DistanceFromStar = 1.52,
                GalaxyId = 1,
                HasAtmosphere = true
            },
            new Planet
            {
                Id = 5,
                Name = "Jupiter",
                Type = "Gas Giant",
                Mass = 317.8,
                Radius = 69911,
                DistanceFromStar = 5.20,
                GalaxyId = 1,
                HasAtmosphere = true
            },
            new Planet
            {
                Id = 6,
                Name = "Saturn",
                Type = "Gas Giant",
                Mass = 95.2,
                Radius = 58232,
                DistanceFromStar = 9.54,
                GalaxyId = 1,
                HasAtmosphere = true
            },
            new Planet
            {
                Id = 7,
                Name = "Uranus",
                Type = "Ice Giant",
                Mass = 14.5,
                Radius = 25362,
                DistanceFromStar = 19.19,
                GalaxyId = 1,
                HasAtmosphere = true
            },
            new Planet
            {
                Id = 8,
                Name = "Neptune",
                Type = "Ice Giant",
                Mass = 17.1,
                Radius = 24622,
                DistanceFromStar = 30.07,
                GalaxyId = 1,
                HasAtmosphere = true
            }
        );
    }
}
