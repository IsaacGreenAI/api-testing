using FluentAssertions;
using System.ComponentModel.DataAnnotations;
using UniverseService.Models;
using Xunit;

namespace UniverseService.Tests.Models;

public class PlanetModelValidationTests
{
    private static IList<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(model, null, null);
        Validator.TryValidateObject(model, validationContext, validationResults, true);
        return validationResults;
    }

    [Fact]
    public void Planet_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var planet = new Planet
        {
            Name = "Earth",
            Type = "Terrestrial",
            Mass = 1.0,
            Radius = 6371,
            DistanceFromStar = 1.0,
            GalaxyId = 1,
            HasAtmosphere = true
        };

        // Act
        var validationResults = ValidateModel(planet);

        // Assert
        validationResults.Should().BeEmpty();
    }

    [Fact]
    public void Planet_WithEmptyName_ShouldFailValidation()
    {
        // Arrange
        var planet = new Planet
        {
            Name = "",
            Type = "Terrestrial",
            Mass = 1.0,
            Radius = 6371,
            DistanceFromStar = 1.0,
            GalaxyId = 1,
            HasAtmosphere = true
        };

        // Act
        var validationResults = ValidateModel(planet);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("Name"));
    }

    [Fact]
    public void Planet_WithEmptyType_ShouldFailValidation()
    {
        // Arrange
        var planet = new Planet
        {
            Name = "Earth",
            Type = "",
            Mass = 1.0,
            Radius = 6371,
            DistanceFromStar = 1.0,
            GalaxyId = 1,
            HasAtmosphere = true
        };

        // Act
        var validationResults = ValidateModel(planet);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("Type"));
    }

    [Fact]
    public void Planet_WithNegativeMass_ShouldFailValidation()
    {
        // Arrange
        var planet = new Planet
        {
            Name = "Earth",
            Type = "Terrestrial",
            Mass = -1.0,
            Radius = 6371,
            DistanceFromStar = 1.0,
            GalaxyId = 1,
            HasAtmosphere = true
        };

        // Act
        var validationResults = ValidateModel(planet);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("Mass"));
    }

    [Fact]
    public void Planet_WithNegativeRadius_ShouldFailValidation()
    {
        // Arrange
        var planet = new Planet
        {
            Name = "Earth",
            Type = "Terrestrial",
            Mass = 1.0,
            Radius = -1,
            DistanceFromStar = 1.0,
            GalaxyId = 1,
            HasAtmosphere = true
        };

        // Act
        var validationResults = ValidateModel(planet);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("Radius"));
    }

    [Fact]
    public void Planet_WithNegativeDistanceFromStar_ShouldFailValidation()
    {
        // Arrange
        var planet = new Planet
        {
            Name = "Earth",
            Type = "Terrestrial",
            Mass = 1.0,
            Radius = 6371,
            DistanceFromStar = -100,
            GalaxyId = 1,
            HasAtmosphere = true
        };

        // Act
        var validationResults = ValidateModel(planet);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("DistanceFromStar"));
    }

    [Fact]
    public void Planet_WithMultipleInvalidFields_ShouldReturnMultipleErrors()
    {
        // Arrange
        var planet = new Planet
        {
            Name = "",
            Type = "",
            Mass = -1.0,
            Radius = -1,
            DistanceFromStar = -100,
            GalaxyId = 999,
            HasAtmosphere = true
        };

        // Act
        var validationResults = ValidateModel(planet);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().HaveCountGreaterThanOrEqualTo(5);
    }
}
