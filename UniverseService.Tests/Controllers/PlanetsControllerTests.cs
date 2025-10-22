using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using UniverseService.Controllers;
using UniverseService.Interfaces;
using UniverseService.Models;
using Xunit;

namespace UniverseService.Tests.Controllers;

public class PlanetsControllerTests
{
    private readonly Mock<IPlanetService> _mockPlanetService;
    private readonly Mock<ILogger<PlanetsController>> _mockLogger;
    private readonly PlanetsController _controller;

    public PlanetsControllerTests()
    {
        _mockPlanetService = new Mock<IPlanetService>();
        _mockLogger = new Mock<ILogger<PlanetsController>>();
        _controller = new PlanetsController(_mockPlanetService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfPlanets()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true },
            new Planet { Id = 2, Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, HasAtmosphere = true }
        };
        _mockPlanetService.Setup(s => s.GetAll()).ReturnsAsync(planets);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedPlanets = okResult.Value.Should().BeAssignableTo<IEnumerable<Planet>>().Subject;
        returnedPlanets.Should().HaveCount(2);
        returnedPlanets.Should().Contain(p => p.Name == "Earth");
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsOkResult_WithPlanet()
    {
        // Arrange
        var planet = new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _mockPlanetService.Setup(s => s.GetById(1)).ReturnsAsync(planet);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedPlanet = okResult.Value.Should().BeOfType<Planet>().Subject;
        returnedPlanet.Name.Should().Be("Earth");
        returnedPlanet.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        _mockPlanetService.Setup(s => s.GetById(999)).ReturnsAsync((Planet?)null);

        // Act
        var result = await _controller.GetById(999);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetByGalaxyId_ReturnsOkResult_WithPlanetsInGalaxy()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, GalaxyId = 1, HasAtmosphere = true }
        };
        _mockPlanetService.Setup(s => s.GetByGalaxyId(1)).ReturnsAsync(planets);

        // Act
        var result = await _controller.GetByGalaxyId(1);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedPlanets = okResult.Value.Should().BeAssignableTo<IEnumerable<Planet>>().Subject;
        returnedPlanets.Should().HaveCount(1);
        returnedPlanets.First().GalaxyId.Should().Be(1);
    }

    [Fact]
    public async Task GetByType_ReturnsOkResult_WithPlanetsOfType()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true },
            new Planet { Id = 2, Name = "Mars", Type = "Terrestrial", Mass = 0.107, Radius = 3389, DistanceFromStar = 1.52, HasAtmosphere = true }
        };
        _mockPlanetService.Setup(s => s.GetByType("Terrestrial")).ReturnsAsync(planets);

        // Act
        var result = await _controller.GetByType("Terrestrial");

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedPlanets = okResult.Value.Should().BeAssignableTo<IEnumerable<Planet>>().Subject;
        returnedPlanets.Should().HaveCount(2);
        returnedPlanets.Should().OnlyContain(p => p.Type == "Terrestrial");
    }

    [Fact]
    public async Task GetWithAtmosphere_ReturnsOkResult_WithPlanetsHavingAtmosphere()
    {
        // Arrange
        var planets = new List<Planet>
        {
            new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true }
        };
        _mockPlanetService.Setup(s => s.GetWithAtmosphere()).ReturnsAsync(planets);

        // Act
        var result = await _controller.GetWithAtmosphere();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedPlanets = okResult.Value.Should().BeAssignableTo<IEnumerable<Planet>>().Subject;
        returnedPlanets.Should().OnlyContain(p => p.HasAtmosphere == true);
    }

    [Fact]
    public async Task Create_WithValidPlanet_ReturnsCreatedAtAction()
    {
        // Arrange
        var newPlanet = new Planet { Name = "Kepler-452b", Type = "Terrestrial", Mass = 5.0, Radius = 8000, DistanceFromStar = 1.05, HasAtmosphere = true };
        var createdPlanet = new Planet { Id = 10, Name = "Kepler-452b", Type = "Terrestrial", Mass = 5.0, Radius = 8000, DistanceFromStar = 1.05, HasAtmosphere = true };
        _mockPlanetService.Setup(s => s.Create(It.IsAny<Planet>())).ReturnsAsync(createdPlanet);

        // Act
        var result = await _controller.Create(newPlanet);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(PlanetsController.GetById));
        createdResult.RouteValues!["id"].Should().Be(10);
        var returnedPlanet = createdResult.Value.Should().BeOfType<Planet>().Subject;
        returnedPlanet.Id.Should().Be(10);
        returnedPlanet.Name.Should().Be("Kepler-452b");
    }

    [Fact]
    public async Task Update_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var updatedPlanet = new Planet { Id = 1, Name = "Earth Updated", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _mockPlanetService.Setup(s => s.Update(1, It.IsAny<Planet>())).ReturnsAsync(updatedPlanet);

        // Act
        var result = await _controller.Update(1, updatedPlanet);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedPlanet = okResult.Value.Should().BeOfType<Planet>().Subject;
        returnedPlanet.Name.Should().Be("Earth Updated");
    }

    [Fact]
    public async Task Update_WithMismatchedId_ReturnsBadRequest()
    {
        // Arrange
        var planet = new Planet { Id = 1, Name = "Earth", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };

        // Act
        var result = await _controller.Update(2, planet);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Update_WithNonExistentPlanet_ReturnsNotFound()
    {
        // Arrange
        var planet = new Planet { Id = 999, Name = "Unknown", Type = "Terrestrial", Mass = 1.0, Radius = 6371, DistanceFromStar = 1.0, HasAtmosphere = true };
        _mockPlanetService.Setup(s => s.Update(999, It.IsAny<Planet>())).ReturnsAsync((Planet?)null);

        // Act
        var result = await _controller.Update(999, planet);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task Delete_WithValidId_ReturnsNoContent()
    {
        // Arrange
        _mockPlanetService.Setup(s => s.Delete(1)).ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(1);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Delete_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        _mockPlanetService.Setup(s => s.Delete(999)).ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(999);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }
}
