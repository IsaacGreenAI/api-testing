namespace UniverseService.Interfaces;

/// <summary>
/// Generic repository interface for common CRUD operations
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Get all entities
    /// </summary>
    Task<IEnumerable<T>> GetAll();

    /// <summary>
    /// Get entity by ID
    /// </summary>
    Task<T?> GetById(int id);

    /// <summary>
    /// Add a new entity
    /// </summary>
    Task<T> Add(T entity);

    /// <summary>
    /// Update an existing entity
    /// </summary>
    Task<T> Update(T entity);

    /// <summary>
    /// Delete an entity by ID
    /// </summary>
    Task<bool> Delete(int id);

    /// <summary>
    /// Check if entity exists by ID
    /// </summary>
    Task<bool> Exists(int id);
}
