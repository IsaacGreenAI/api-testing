using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using UniverseService.Interfaces;
using UniverseService.Models;
using UniverseService.Services;
using Xunit;

namespace UniverseService.Tests.Services;

public class PlanetServiceTests
{
    private readonly Mock<IPlanetRepository> _mockRepository;
    private readonly Mock<ILogger<PlanetService>> _mockLogger;
    private readonly PlanetService _service;

    public PlanetServiceTests()
    {
        _mockRepository = new Mock<IPlanetRepository>();
        _mockLogger = new Mock<ILogger<PlanetService>>();
        _service = new PlanetService(_mockRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAll_DelegatesToRepository()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true },
            new Planet { Id = 2, Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, HasAtmosphere = true }
        };
        _mockRepository.Setup(r => r.GetAll()).ReturnsAsync(planets);

        // Act
        var result = await _service.GetAll();

        // Assert
        result.Should().BeEquivalentTo(planets);
        _mockRepository.Verify(r => r.GetAll(), Times.Once);
    }

    [Fact]
    public async Task GetById_DelegatesToRepository()
    {
        // Arrange
        var planet = new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _mockRepository.Setup(r => r.GetById(1)).ReturnsAsync(planet);

        // Act
        var result = await _service.GetById(1);

        // Assert
        result.Should().BeEquivalentTo(planet);
        _mockRepository.Verify(r => r.GetById(1), Times.Once);
    }

    [Fact]
    public async Task GetById_WithNonExistentId_ReturnsNull()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetById(999)).ReturnsAsync((Planet?)null);

        // Act
        var result = await _service.GetById(999);

        // Assert
        result.Should().BeNull();
        _mockRepository.Verify(r => r.GetById(999), Times.Once);
    }

    [Fact]
    public async Task GetByGalaxyId_DelegatesToRepository()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, GalaxyId = 1, HasAtmosphere = true }
        };
        _mockRepository.Setup(r => r.GetByGalaxyId(1)).ReturnsAsync(planets);

        // Act
        var result = await _service.GetByGalaxyId(1);

        // Assert
        result.Should().BeEquivalentTo(planets);
        _mockRepository.Verify(r => r.GetByGalaxyId(1), Times.Once);
    }

    [Fact]
    public async Task GetByType_DelegatesToRepository()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true },
            new Planet { Id = 2, Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, HasAtmosphere = true }
        };
        _mockRepository.Setup(r => r.GetByType("Terrestrial")).ReturnsAsync(planets);

        // Act
        var result = await _service.GetByType("Terrestrial");

        // Assert
        result.Should().BeEquivalentTo(planets);
        _mockRepository.Verify(r => r.GetByType("Terrestrial"), Times.Once);
    }

    [Fact]
    public async Task GetWithAtmosphere_DelegatesToRepository()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true }
        };
        _mockRepository.Setup(r => r.GetWithAtmosphere()).ReturnsAsync(planets);

        // Act
        var result = await _service.GetWithAtmosphere();

        // Assert
        result.Should().BeEquivalentTo(planets);
        _mockRepository.Verify(r => r.GetWithAtmosphere(), Times.Once);
    }

    [Fact]
    public async Task Create_DelegatesToRepository_AndLogsInformation()
    {
        // Arrange
        var newPlanet = new Planet { Name = "Kepler-452b", Type = "Terrestrial", Mass = 5.0, Radius = 8000, DistanceFromStar = 1.05, HasAtmosphere = true };
        var createdPlanet = new Planet { Id = 10, Name = "Kepler-452b", Type = "Terrestrial", Mass = 5.0, Radius = 8000, DistanceFromStar = 1.05, HasAtmosphere = true };
        _mockRepository.Setup(r => r.Add(It.IsAny<Planet>())).ReturnsAsync(createdPlanet);

        // Act
        var result = await _service.Create(newPlanet);

        // Assert
        result.Should().BeEquivalentTo(createdPlanet);
        _mockRepository.Verify(r => r.Add(newPlanet), Times.Once);
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Creating planet: Kepler-452b")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task Update_DelegatesToRepository_AndLogsInformation()
    {
        // Arrange
        var updatedPlanet = new Planet { Id = 1, Name = "Earth Updated", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _mockRepository.Setup(r => r.Exists(1)).ReturnsAsync(true);
        _mockRepository.Setup(r => r.Update(It.IsAny<Planet>())).ReturnsAsync(updatedPlanet);

        // Act
        var result = await _service.Update(1, updatedPlanet);

        // Assert
        result.Should().BeEquivalentTo(updatedPlanet);
        _mockRepository.Verify(r => r.Exists(1), Times.Once);
        _mockRepository.Verify(r => r.Update(updatedPlanet), Times.Once);
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Updating planet with ID: 1")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task Update_WithNonExistentId_ReturnsNull()
    {
        // Arrange
        var planet = new Planet { Id = 999, Name = "Unknown", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _mockRepository.Setup(r => r.Exists(999)).ReturnsAsync(false);

        // Act
        var result = await _service.Update(999, planet);

        // Assert
        result.Should().BeNull();
        _mockRepository.Verify(r => r.Exists(999), Times.Once);
        _mockRepository.Verify(r => r.Update(It.IsAny<Planet>()), Times.Never);
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
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Deleting planet with ID: 1")),
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
