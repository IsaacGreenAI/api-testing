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
    public required string Name { get; set; }

    /// <summary>
    /// Type of planet (e.g., Terrestrial, Gas Giant, Ice Giant)
    /// </summary>
    public required string Type { get; set; }

    /// <summary>
    /// Mass in Earth masses
    /// </summary>
    public double Mass { get; set; }

    /// <summary>
    /// Radius in kilometers
    /// </summary>
    public double Radius { get; set; }

    /// <summary>
    /// Distance from its star in AU (Astronomical Units)
    /// </summary>
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
