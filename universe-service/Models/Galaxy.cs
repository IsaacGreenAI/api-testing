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
    public required string Name { get; set; }

    /// <summary>
    /// Type of galaxy (e.g., Spiral, Elliptical, Irregular)
    /// </summary>
    public required string Type { get; set; }

    /// <summary>
    /// Estimated number of stars in billions
    /// </summary>
    public double StarCount { get; set; }

    /// <summary>
    /// Distance from Earth in light years
    /// </summary>
    public double DistanceFromEarth { get; set; }

    /// <summary>
    /// Diameter of the galaxy in light years
    /// </summary>
    public double Diameter { get; set; }

    /// <summary>
    /// Whether the galaxy contains a supermassive black hole
    /// </summary>
    public bool HasBlackHole { get; set; }
}
