using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using UniverseService.Controllers;
using UniverseService.Interfaces;
using UniverseService.Models;
using Xunit;

namespace UniverseService.Tests.Controllers;

public class GalaxiesControllerTests
{
    private readonly Mock<IGalaxyService> _mockGalaxyService;
    private readonly Mock<ILogger<GalaxiesController>> _mockLogger;
    private readonly GalaxiesController _controller;

    public GalaxiesControllerTests()
    {
        _mockGalaxyService = new Mock<IGalaxyService>();
        _mockLogger = new Mock<ILogger<GalaxiesController>>();
        _controller = new GalaxiesController(_mockGalaxyService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkResult_WithListOfGalaxies()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Id = 2, Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true }
        };
        _mockGalaxyService.Setup(s => s.GetAll()).ReturnsAsync(galaxies);

        // Act
        var result = await _controller.GetAll();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedGalaxies = okResult.Value.Should().BeAssignableTo<IEnumerable<Galaxy>>().Subject;
        returnedGalaxies.Should().HaveCount(2);
        returnedGalaxies.Should().Contain(g => g.Name == "Milky Way");
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsOkResult_WithGalaxy()
    {
        // Arrange
        var galaxy = new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _mockGalaxyService.Setup(s => s.GetById(1)).ReturnsAsync(galaxy);

        // Act
        var result = await _controller.GetById(1);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedGalaxy = okResult.Value.Should().BeOfType<Galaxy>().Subject;
        returnedGalaxy.Name.Should().Be("Milky Way");
        returnedGalaxy.Id.Should().Be(1);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        _mockGalaxyService.Setup(s => s.GetById(999)).ReturnsAsync((Galaxy?)null);

        // Act
        var result = await _controller.GetById(999);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetByType_ReturnsOkResult_WithGalaxiesOfType()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Id = 2, Name = "Andromeda", Type = "Spiral", StarCount = 1000000000000, DistanceFromEarth = 2537000, Diameter = 220000, HasBlackHole = true }
        };
        _mockGalaxyService.Setup(s => s.GetByType("Spiral")).ReturnsAsync(galaxies);

        // Act
        var result = await _controller.GetByType("Spiral");

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedGalaxies = okResult.Value.Should().BeAssignableTo<IEnumerable<Galaxy>>().Subject;
        returnedGalaxies.Should().HaveCount(2);
        returnedGalaxies.Should().OnlyContain(g => g.Type == "Spiral");
    }

    [Fact]
    public async Task GetWithBlackHole_ReturnsOkResult_WithGalaxiesHavingBlackHole()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true }
        };
        _mockGalaxyService.Setup(s => s.GetWithBlackHole()).ReturnsAsync(galaxies);

        // Act
        var result = await _controller.GetWithBlackHole();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedGalaxies = okResult.Value.Should().BeAssignableTo<IEnumerable<Galaxy>>().Subject;
        returnedGalaxies.Should().OnlyContain(g => g.HasBlackHole == true);
    }

    [Fact]
    public async Task GetWithinDistance_ReturnsOkResult_WithNearbyGalaxies()
    {
        // Arrange
        var galaxies = new List<Galaxy>
        {
            new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true },
            new Galaxy { Id = 3, Name = "Triangulum", Type = "Spiral", StarCount = 40000000000, DistanceFromEarth = 3000000, Diameter = 60000, HasBlackHole = false }
        };
        _mockGalaxyService.Setup(s => s.GetWithinDistance(3500000)).ReturnsAsync(galaxies);

        // Act
        var result = await _controller.GetWithinDistance(3500000);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedGalaxies = okResult.Value.Should().BeAssignableTo<IEnumerable<Galaxy>>().Subject;
        returnedGalaxies.Should().HaveCount(2);
        returnedGalaxies.Should().OnlyContain(g => g.DistanceFromEarth <= 3500000);
    }

    [Fact]
    public async Task Create_WithValidGalaxy_ReturnsCreatedAtAction()
    {
        // Arrange
        var newGalaxy = new Galaxy { Name = "Whirlpool", Type = "Spiral", StarCount = 100000000000, DistanceFromEarth = 23000000, Diameter = 76000, HasBlackHole = true };
        var createdGalaxy = new Galaxy { Id = 10, Name = "Whirlpool", Type = "Spiral", StarCount = 100000000000, DistanceFromEarth = 23000000, Diameter = 76000, HasBlackHole = true };
        _mockGalaxyService.Setup(s => s.Create(It.IsAny<Galaxy>())).ReturnsAsync(createdGalaxy);

        // Act
        var result = await _controller.Create(newGalaxy);

        // Assert
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.ActionName.Should().Be(nameof(GalaxiesController.GetById));
        createdResult.RouteValues!["id"].Should().Be(10);
        var returnedGalaxy = createdResult.Value.Should().BeOfType<Galaxy>().Subject;
        returnedGalaxy.Id.Should().Be(10);
        returnedGalaxy.Name.Should().Be("Whirlpool");
    }

    [Fact]
    public async Task Update_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var updatedGalaxy = new Galaxy { Id = 1, Name = "Milky Way Updated", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };
        _mockGalaxyService.Setup(s => s.Update(1, It.IsAny<Galaxy>())).ReturnsAsync(updatedGalaxy);

        // Act
        var result = await _controller.Update(1, updatedGalaxy);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedGalaxy = okResult.Value.Should().BeOfType<Galaxy>().Subject;
        returnedGalaxy.Name.Should().Be("Milky Way Updated");
    }

    [Fact]
    public async Task Update_WithMismatchedId_ReturnsBadRequest()
    {
        // Arrange
        var galaxy = new Galaxy { Id = 1, Name = "Milky Way", Type = "Spiral", StarCount = 250000000000, DistanceFromEarth = 0, Diameter = 105700, HasBlackHole = true };

        // Act
        var result = await _controller.Update(2, galaxy);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Update_WithNonExistentGalaxy_ReturnsNotFound()
    {
        // Arrange
        var galaxy = new Galaxy { Id = 999, Name = "Unknown", Type = "Spiral", StarCount = 100000000000, DistanceFromEarth = 50000000, Diameter = 80000, HasBlackHole = false };
        _mockGalaxyService.Setup(s => s.Update(999, It.IsAny<Galaxy>())).ReturnsAsync((Galaxy?)null);

        // Act
        var result = await _controller.Update(999, galaxy);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task Delete_WithValidId_ReturnsNoContent()
    {
        // Arrange
        _mockGalaxyService.Setup(s => s.Delete(1)).ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(1);

        // Assert
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Delete_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        _mockGalaxyService.Setup(s => s.Delete(999)).ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(999);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }
}
