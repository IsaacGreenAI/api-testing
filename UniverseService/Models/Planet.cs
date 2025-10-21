using System.ComponentModel.DataAnnotations;

namespace UniverseService.Models;

/// <summary>
/// Represents a planet in the universe
/// </summary>
public class Planet
{
    /// <summary>
    /// Unique identifier for the planet
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Name of the planet (e.g., Earth, Mars, Jupiter)
    /// </summary>
    [Required(ErrorMessage = "Planet name is required")]
    [MinLength(1, ErrorMessage = "Planet name cannot be empty")]
    public required string Name { get; set; }

    /// <summary>
    /// Type of planet (e.g., Terrestrial, Gas Giant, Ice Giant)
    /// </summary>
    [Required(ErrorMessage = "Planet type is required")]
    [MinLength(1, ErrorMessage = "Planet type cannot be empty")]
    public required string Type { get; set; }

    /// <summary>
    /// Mass in Earth masses
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Mass must be non-negative")]
    public double Mass { get; set; }

    /// <summary>
    /// Radius in kilometers
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Radius must be non-negative")]
    public double Radius { get; set; }

    /// <summary>
    /// Distance from its star in AU (Astronomical Units)
    /// </summary>
    [Range(0, double.MaxValue, ErrorMessage = "Distance from star must be non-negative")]
    public double DistanceFromStar { get; set; }

    /// <summary>
    /// ID of the galaxy this planet belongs to
    /// </summary>
    public int? GalaxyId { get; set; }

    /// <summary>
    /// Whether the planet has an atmosphere
    /// </summary>
    public bool HasAtmosphere { get; set; }
}
