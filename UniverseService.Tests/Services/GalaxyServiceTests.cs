using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using UniverseService.Interfaces;
using UniverseService.Models;
using UniverseService.Services;
using Xunit;

namespace UniverseService.Tests.Services;

public class GalaxyServiceTests
{
    private readonly Mock<IGalaxyRepository> _mockRepository;
    private readonly Mock<ILogger<GalaxyService>> _mockLogger;
    private readonly GalaxyService _service;

    public GalaxyServiceTests()
    {
        _mockRepository = new Mock<IGalaxyRepository>();
        _mockLogger = new Mock<ILogger<GalaxyService>>();
        _service = new GalaxyService(_mockRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAll_DelegatesToRepository()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Id = 2, Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true }
        };
        _mockRepository.Setup(r => r.GetAll()).ReturnsAsync(galaxies);

        // Act
        var result = await _service.GetAll();

        // Assert
        result.Should().BeEquivalentTo(galaxies);
        _mockRepository.Verify(r => r.GetAll(), Times.Once);
    }

    [Fact]
    public async Task GetById_DelegatesToRepository()
    {
        // Arrange
        var galaxy = new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _mockRepository.Setup(r => r.GetById(1)).ReturnsAsync(galaxy);

        // Act
        var result = await _service.GetById(1);

        // Assert
        result.Should().BeEquivalentTo(galaxy);
        _mockRepository.Verify(r => r.GetById(1), Times.Once);
    }

    [Fact]
    public async Task GetById_WithNonExistentId_ReturnsNull()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetById(999)).ReturnsAsync((Galaxy?)null);

        // Act
        var result = await _service.GetById(999);

        // Assert
        result.Should().BeNull();
        _mockRepository.Verify(r => r.GetById(999), Times.Once);
    }

    [Fact]
    public async Task GetByType_DelegatesToRepository()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Id = 2, Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true }
        };
        _mockRepository.Setup(r => r.GetByType("Spiral")).ReturnsAsync(galaxies);

        // Act
        var result = await _service.GetByType("Spiral");

        // Assert
        result.Should().BeEquivalentTo(galaxies);
        _mockRepository.Verify(r => r.GetByType("Spiral"), Times.Once);
    }

    [Fact]
    public async Task GetWithBlackHole_DelegatesToRepository()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true }
        };
        _mockRepository.Setup(r => r.GetWithBlackHole()).ReturnsAsync(galaxies);

        // Act
        var result = await _service.GetWithBlackHole();

        // Assert
        result.Should().BeEquivalentTo(galaxies);
        _mockRepository.Verify(r => r.GetWithBlackHole(), Times.Once);
    }

    [Fact]
    public async Task GetWithinDistance_DelegatesToRepository()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Id = 3, Name = "Triangulum", Type = "Spiral", StarCount = 40000000000, DistanceFromEarth = 3000000, Diameter = 60000, HasBlackHole = false }
        };
        _mockRepository.Setup(r => r.GetWithinDistance(3500000)).ReturnsAsync(galaxies);

        // Act
        var result = await _service.GetWithinDistance(3500000);

        // Assert
        result.Should().BeEquivalentTo(galaxies);
        _mockRepository.Verify(r => r.GetWithinDistance(3500000), Times.Once);
    }

    [Fact]
    public async Task Create_DelegatesToRepository_AndLogsInformation()
    {
        // Arrange
        var newGalaxy = new Galaxy { Name = "Whirlpool", Type = "Spiral", StarCount = 100000000000, DistanceFromEarth = 23000000, Diameter = 76000, HasBlackHole = true };
        var createdGalaxy = new Galaxy { Id = 10, Name = "Whirlpool", Type = "Spiral", StarCount = 100000000000, DistanceFromEarth = 23000000, Diameter = 76000, HasBlackHole = true };
        _mockRepository.Setup(r => r.Add(It.IsAny<Galaxy>())).ReturnsAsync(createdGalaxy);

        // Act
        var result = await _service.Create(newGalaxy);

        // Assert
        result.Should().BeEquivalentTo(createdGalaxy);
        _mockRepository.Verify(r => r.Add(newGalaxy), Times.Once);
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Creating galaxy: Whirlpool")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task Update_DelegatesToRepository_AndLogsInformation()
    {
        // Arrange
        var updatedGalaxy = new Galaxy { Id = 1, Name = "Milky Way Updated", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _mockRepository.Setup(r => r.Exists(1)).ReturnsAsync(true);
        _mockRepository.Setup(r => r.Update(It.IsAny<Galaxy>())).ReturnsAsync(updatedGalaxy);

        // Act
        var result = await _service.Update(1, updatedGalaxy);

        // Assert
        result.Should().BeEquivalentTo(updatedGalaxy);
        _mockRepository.Verify(r => r.Exists(1), Times.Once);
        _mockRepository.Verify(r => r.Update(updatedGalaxy), Times.Once);
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Updating galaxy with ID: 1")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task Update_WithNonExistentId_ReturnsNull()
    {
        // Arrange
        var galaxy = new Galaxy { Id = 999, Name = "Unknown", Type = "Spiral", StarCount = 100000000000, DistanceFromEarth = 50000000, Diameter = 80000, HasBlackHole = false };
        _mockRepository.Setup(r => r.Exists(999)).ReturnsAsync(false);

        // Act
        var result = await _service.Update(999, galaxy);

        // Assert
        result.Should().BeNull();
        _mockRepository.Verify(r => r.Exists(999), Times.Once);
        _mockRepository.Verify(r => r.Update(It.IsAny<Galaxy>()), Times.Never);
    }

    [Fact]
    public async Task Delete_DelegatesToRepository_AndLogsInformation()
    {
        // Arrange
        _mockRepository.Setup(r => r.Delete(1)).ReturnsAsync(true);

        // Act
        var result = await _service.Delete(1);

        // Assert
        result.Should().BeTrue();
        _mockRepository.Verify(r => r.Delete(1), Times.Once);
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Deleting galaxy with ID: 1")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task Delete_WithNonExistentId_ReturnsFalse()
    {
        // Arrange
        _mockRepository.Setup(r => r.Delete(999)).ReturnsAsync(false);

        // Act
        var result = await _service.Delete(999);

        // Assert
        result.Should().BeFalse();
        _mockRepository.Verify(r => r.Delete(999), Times.Once);
    }
}
