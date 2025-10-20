using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using UniverseService.Data;
using UniverseService.Models;
using UniverseService.Repositories;
using Xunit;

namespace UniverseService.Tests.Repositories;

public class GalaxyRepositoryTests : IDisposable
{
    private readonly UniverseDbContext _context;
    private readonly GalaxyRepository _repository;

    public GalaxyRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<UniverseDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new UniverseDbContext(options);
        _repository = new GalaxyRepository(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public async Task GetAll_ReturnsAllGalaxies()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true }
        };
        _context.Galaxies.AddRange(galaxies);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetAll();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(g => g.Name == "Milky Way");
        result.Should().Contain(g => g.Name == "Andromeda");
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsGalaxy()
    {
        // Arrange
        var galaxy = new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _context.Galaxies.Add(galaxy);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetById(galaxy.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Milky Way");
        result.Id.Should().Be(galaxy.Id);
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
    public async Task GetByType_ReturnsGalaxiesOfType()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true },
            new Galaxy { Name = "Maffei 1", Type = "Elliptical", StarCount = 500000000000, DistanceFromEarth = 9800000, Diameter = 75000, HasBlackHole = false }
        };
        _context.Galaxies.AddRange(galaxies);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetByType("Spiral");

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(g => g.Type == "Spiral");
        result.Should().Contain(g => g.Name == "Milky Way");
        result.Should().Contain(g => g.Name == "Andromeda");
    }

    [Fact]
    public async Task GetWithBlackHole_ReturnsGalaxiesWithBlackHole()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true },
            new Galaxy { Name = "Triangulum", Type = "Spiral", StarCount = 40000000000, DistanceFromEarth = 3000000, Diameter = 60000, HasBlackHole = false }
        };
        _context.Galaxies.AddRange(galaxies);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetWithBlackHole();

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(g => g.HasBlackHole == true);
        result.Should().Contain(g => g.Name == "Milky Way");
        result.Should().Contain(g => g.Name == "Andromeda");
    }

    [Fact]
    public async Task GetWithinDistance_ReturnsNearbyGalaxies()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true },
            new Galaxy { Name = "Triangulum", Type = "Spiral", StarCount = 40000000000, DistanceFromEarth = 3000000, Diameter = 60000, HasBlackHole = false },
            new Galaxy { Name = "Sombrero", Type = "Spiral", StarCount = 800000000000, DistanceFromEarth = 29350000, Diameter = 50000, HasBlackHole = true }
        };
        _context.Galaxies.AddRange(galaxies);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetWithinDistance(3500000);

        // Assert
        result.Should().HaveCount(3);
        result.Should().OnlyContain(g => g.DistanceFromEarth <= 3500000);
        result.Should().Contain(g => g.Name == "Milky Way");
        result.Should().Contain(g => g.Name == "Andromeda");
        result.Should().Contain(g => g.Name == "Triangulum");
    }

    [Fact]
    public async Task Add_CreatesGalaxy_AndReturnsWithId()
    {
        // Arrange
        var galaxy = new Galaxy { Name = "Whirlpool", Type = "Spiral", StarCount = 100000000000, DistanceFromEarth = 23000000, Diameter = 76000, HasBlackHole = true };

        // Act
        var result = await _repository.Add(galaxy);

        // Assert
        result.Id.Should().BeGreaterThan(0);
        result.Name.Should().Be("Whirlpool");

        var savedGalaxy = await _context.Galaxies.FindAsync(result.Id);
        savedGalaxy.Should().NotBeNull();
        savedGalaxy!.Name.Should().Be("Whirlpool");
    }

    [Fact]
    public async Task Update_ModifiesGalaxy_AndReturnsUpdated()
    {
        // Arrange
        var galaxy = new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _context.Galaxies.Add(galaxy);
        await _context.SaveChangesAsync();

        // Detach to simulate update from different context
        _context.Entry(galaxy).State = EntityState.Detached;

        galaxy.Name = "Milky Way Updated";

        // Act
        var result = await _repository.Update(galaxy);

        // Assert
        result.Name.Should().Be("Milky Way Updated");

        var updatedGalaxy = await _context.Galaxies.FindAsync(galaxy.Id);
        updatedGalaxy!.Name.Should().Be("Milky Way Updated");
    }

    [Fact]
    public async Task Delete_RemovesGalaxy_AndReturnsTrue()
    {
        // Arrange
        var galaxy = new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _context.Galaxies.Add(galaxy);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.Delete(galaxy.Id);

        // Assert
        result.Should().BeTrue();

        var deletedGalaxy = await _context.Galaxies.FindAsync(galaxy.Id);
        deletedGalaxy.Should().BeNull();
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
        var galaxy = new Galaxy { Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _context.Galaxies.Add(galaxy);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.Exists(galaxy.Id);

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
