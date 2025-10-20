using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using UniverseService.Data;
using UniverseService.Models;
using UniverseService.Repositories;
using Xunit;

namespace UniverseService.Tests.Repositories;

public class PlanetRepositoryTests : IDisposable
{
    private readonly UniverseDbContext _context;
    private readonly PlanetRepository _repository;

    public PlanetRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<UniverseDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new UniverseDbContext(options);
        _repository = new PlanetRepository(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public async Task GetAll_ReturnsAllPlanets()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true },
            new Planet { Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, HasAtmosphere = true }
        };
        _context.Planets.AddRange(planets);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetAll();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(p => p.Name == "Earth");
        result.Should().Contain(p => p.Name == "Mars");
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsPlanet()
    {
        // Arrange
        var planet = new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _context.Planets.Add(planet);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetById(planet.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Earth");
        result.Id.Should().Be(planet.Id);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNull()
    {
        // Act
        var result = await _repository.GetById(999);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByGalaxyId_ReturnsPlanetsInGalaxy()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, GalaxyId = 1, HasAtmosphere = true },
            new Planet { Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, GalaxyId = 1, HasAtmosphere = true },
            new Planet { Name = "Kepler", Type = "Terrestrial", Mass = 5.0, Radius = 8000, DistanceFromStar = 1.05, GalaxyId = 2, HasAtmosphere = true }
        };
        _context.Planets.AddRange(planets);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByGalaxyId(1);

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(p => p.GalaxyId == 1);
        result.Should().Contain(p => p.Name == "Earth");
        result.Should().Contain(p => p.Name == "Mars");
    }

    [Fact]
    public async Task GetByType_ReturnsPlanetsOfType()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true },
            new Planet { Name = "Jupiter", Type = "Gas Giant", Mass = 317.8, Radius = 69911, DistanceFromStar = 5.2, HasAtmosphere = true },
            new Planet { Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, HasAtmosphere = true }
        };
        _context.Planets.AddRange(planets);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByType("Terrestrial");

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(p => p.Type == "Terrestrial");
        result.Should().Contain(p => p.Name == "Earth");
        result.Should().Contain(p => p.Name == "Mars");
    }

    [Fact]
    public async Task GetWithAtmosphere_ReturnsPlanetsWithAtmosphere()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true },
            new Planet { Name = "Mercury", Type = "Terrestrial", Mass = 0.055, Radius = 2439, DistanceFromStar = 0.39, HasAtmosphere = false },
            new Planet { Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, HasAtmosphere = true }
        };
        _context.Planets.AddRange(planets);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetWithAtmosphere();

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(p => p.HasAtmosphere == true);
        result.Should().Contain(p => p.Name == "Earth");
        result.Should().Contain(p => p.Name == "Mars");
    }

    [Fact]
    public async Task Add_CreatesPlanet_AndReturnsWithId()
    {
        // Arrange
        var planet = new Planet { Name = "Kepler-452b", Type = "Terrestrial", Mass = 5.0, Radius = 8000, DistanceFromStar = 1.05, HasAtmosphere = true };

        // Act
        var result = await _repository.Add(planet);

        // Assert
        result.Id.Should().BeGreaterThan(0);
        result.Name.Should().Be("Kepler-452b");

        var savedPlanet = await _context.Planets.FindAsync(result.Id);
        savedPlanet.Should().NotBeNull();
        savedPlanet!.Name.Should().Be("Kepler-452b");
    }

    [Fact]
    public async Task Update_ModifiesPlanet_AndReturnsUpdated()
    {
        // Arrange
        var planet = new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _context.Planets.Add(planet);
        await _context.SaveChangesAsync();

        // Detach to simulate update from different context
        _context.Entry(planet).State = EntityState.Detached;

        planet.Name = "Earth Updated";

        // Act
        var result = await _repository.Update(planet);

        // Assert
        result.Name.Should().Be("Earth Updated");

        var updatedPlanet = await _context.Planets.FindAsync(planet.Id);
        updatedPlanet!.Name.Should().Be("Earth Updated");
    }

    [Fact]
    public async Task Delete_RemovesPlanet_AndReturnsTrue()
    {
        // Arrange
        var planet = new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _context.Planets.Add(planet);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.Delete(planet.Id);

        // Assert
        result.Should().BeTrue();

        var deletedPlanet = await _context.Planets.FindAsync(planet.Id);
        deletedPlanet.Should().BeNull();
    }

    [Fact]
    public async Task Delete_WithInvalidId_ReturnsFalse()
    {
        // Act
        var result = await _repository.Delete(999);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task Exists_WithValidId_ReturnsTrue()
    {
        // Arrange
        var planet = new Planet { Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _context.Planets.Add(planet);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.Exists(planet.Id);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task Exists_WithInvalidId_ReturnsFalse()
    {
        // Act
        var result = await _repository.Exists(999);

        // Assert
        result.Should().BeFalse();
    }
}
