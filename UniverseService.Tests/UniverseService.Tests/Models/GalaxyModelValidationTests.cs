using FluentAssertions;
using System.ComponentModel.DataAnnotations;
using UniverseService.Models;
using Xunit;

namespace UniverseService.Tests.Models;

public class GalaxyModelValidationTests
{
    private static IList<ValidationResult> ValidateModel(object model)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(model, null, null);
        Validator.TryValidateObject(model, validationContext, validationResults, true);
        return validationResults;
    }

    [Fact]
    public void Galaxy_WithValidData_ShouldPassValidation()
    {
        // Arrange
        var galaxy = new Galaxy
        {
            Name = "Milky Way",
            Type = "Spiral",
            StarCount = 250000000000,
            DistanceFromEarth = 0,
            Diameter = 105700,
            HasBlackHole = true
        };

        // Act
        var validationResults = ValidateModel(galaxy);

        // Assert
        validationResults.Should().BeEmpty();
    }

    [Fact]
    public void Galaxy_WithEmptyName_ShouldFailValidation()
    {
        // Arrange
        var galaxy = new Galaxy
        {
            Name = "",
            Type = "Spiral",
            StarCount = 250000000000,
            DistanceFromEarth = 0,
            Diameter = 105700,
            HasBlackHole = true
        };

        // Act
        var validationResults = ValidateModel(galaxy);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("Name"));
    }

    [Fact]
    public void Galaxy_WithEmptyType_ShouldFailValidation()
    {
        // Arrange
        var galaxy = new Galaxy
        {
            Name = "Milky Way",
            Type = "",
            StarCount = 250000000000,
            DistanceFromEarth = 0,
            Diameter = 105700,
            HasBlackHole = true
        };

        // Act
        var validationResults = ValidateModel(galaxy);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("Type"));
    }

    [Fact]
    public void Galaxy_WithNegativeStarCount_ShouldFailValidation()
    {
        // Arrange
        var galaxy = new Galaxy
        {
            Name = "Milky Way",
            Type = "Spiral",
            StarCount = -100,
            DistanceFromEarth = 0,
            Diameter = 105700,
            HasBlackHole = true
        };

        // Act
        var validationResults = ValidateModel(galaxy);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("StarCount"));
    }

    [Fact]
    public void Galaxy_WithNegativeDistance_ShouldFailValidation()
    {
        // Arrange
        var galaxy = new Galaxy
        {
            Name = "Milky Way",
            Type = "Spiral",
            StarCount = 250000000000,
            DistanceFromEarth = -1000,
            Diameter = 105700,
            HasBlackHole = true
        };

        // Act
        var validationResults = ValidateModel(galaxy);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("DistanceFromEarth"));
    }

    [Fact]
    public void Galaxy_WithNegativeDiameter_ShouldFailValidation()
    {
        // Arrange
        var galaxy = new Galaxy
        {
            Name = "Milky Way",
            Type = "Spiral",
            StarCount = 250000000000,
            DistanceFromEarth = 0,
            Diameter = -50,
            HasBlackHole = true
        };

        // Act
        var validationResults = ValidateModel(galaxy);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().Contain(v => v.MemberNames.Contains("Diameter"));
    }

    [Fact]
    public void Galaxy_WithMultipleInvalidFields_ShouldReturnMultipleErrors()
    {
        // Arrange
        var galaxy = new Galaxy
        {
            Name = "",
            Type = "",
            StarCount = -100,
            DistanceFromEarth = -1000,
            Diameter = -50,
            HasBlackHole = true
        };

        // Act
        var validationResults = ValidateModel(galaxy);

        // Assert
        validationResults.Should().NotBeEmpty();
        validationResults.Should().HaveCountGreaterThanOrEqualTo(5);
    }
}
