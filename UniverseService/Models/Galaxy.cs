using System.ComponentModel.DataAnnotations;

namespace UniverseService.Models;

/// <summary>
/// Represents a galaxy in the universe
/// </summary>
public class Galaxy
{
    /// <summary>
    /// Unique identifier for the galaxy
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Name of the galaxy (e.g., Milky Way, Andromeda)
    /// </summary>
    [Required(ErrorMessage = "Galaxy name is required")]
    [MinLength(1, ErrorMessage = "Galaxy name cannot be empty")]
    public required string Name { get; set; }

    /// <summary>
    /// Type of galaxy (e.g., Spiral, Elliptical, Irregular)
    /// </summary>
    [Required(ErrorMessage = "Galaxy type is required")]
    [MinLength(1, ErrorMessage = "Galaxy type cannot be empty")]
    public required string Type { get; set; }

    /// <summary>
    /// Estimated number of stars in billions
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Star count must be non-negative")]
    public double StarCount { get; set; }

    /// <summary>
    /// Distance from Earth in light years
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Distance from Earth must be non-negative")]
    public double DistanceFromEarth { get; set; }

    /// <summary>
    /// Diameter of the galaxy in light years
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Diameter must be non-negative")]
    public double Diameter { get; set; }

    /// <summary>
    /// Whether the galaxy contains a supermassive black hole
    /// </summary>
    public bool HasBlackHole { get; set; }
}
