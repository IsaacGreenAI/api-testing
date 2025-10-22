import { test, expect } from '../fixtures/httpClient.fixture.ts';
import { TResponse } from '@commons/http-client/TResponse.ts';

const BASE_URL = process.env.UNIVERSE_API_URL || 'http://localhost:8080';

interface Planet {
  id?: number;
  name: string;
  type: string;
  mass: number;
  radius: number;
  distanceFromStar: number;
  galaxyId: number;
  hasAtmosphere: boolean;
}

test.describe('Planets API Endpoints', () => {
  test.describe('GET /api/planets', () => {
    test('should return all planets', async ({ httpClient }) => {
      const response: TResponse<Planet[]> = await httpClient.get<Planet[]>(`${BASE_URL}/api/planets`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);
    });

    test('should return planets with correct schema', async ({ httpClient }) => {
      const response: TResponse<Planet[]> = await httpClient.get<Planet[]>(`${BASE_URL}/api/planets`);

      expect(response.isSuccess).toBe(true);
      const planet = response.data![0];
      expect(planet).toHaveProperty('id');
      expect(planet).toHaveProperty('name');
      expect(planet).toHaveProperty('type');
      expect(planet).toHaveProperty('mass');
      expect(planet).toHaveProperty('radius');
      expect(planet).toHaveProperty('distanceFromStar');
      expect(planet).toHaveProperty('galaxyId');
      expect(planet).toHaveProperty('hasAtmosphere');
    });
  });

  test.describe('POST /api/planets', () => {
    test('should create a new planet', async ({ httpClient }) => {
      const newPlanet: Planet = {
        name: `Kepler-452b ${Date.now()}`,
        type: 'Exoplanet',
        mass: 5.0,
        radius: 6371,
        distanceFromStar: 1400,
        galaxyId: 1,
        hasAtmosphere: true
      };

      const response: TResponse<Planet> = await httpClient.post<Planet>(`${BASE_URL}/api/planets`, newPlanet);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        type: 'Exoplanet',
        mass: 5.0,
        radius: 6371,
        distanceFromStar: 1400,
        galaxyId: 1,
        hasAtmosphere: true
      });
      expect(response.data!.name).toContain('Kepler-452b');
      expect(response.data!.id).toBeDefined();
    });

    test('should reject planet creation with invalid data', async ({ httpClient }) => {
      const invalidPlanet = {
        name: '', // Empty name - violates MinLength validation
        type: '', // Empty type - violates MinLength validation
        mass: -1, // Negative mass - violates Range validation
        radius: -1, // Negative radius - violates Range validation
        distanceFromStar: -100, // Negative distance - violates Range validation
        galaxyId: 999, // Non-existent galaxy (won't be validated at model level)
        hasAtmosphere: true
      };

      const response: TResponse<Planet> = await httpClient.post(`${BASE_URL}/api/planets`, invalidPlanet);

      // API should return 400 Bad Request for validation errors
      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(400);
    });
  });

  test.describe('GET /api/planets/{id}', () => {
    test('should return planet by ID', async ({ httpClient }) => {
      const response: TResponse<Planet> = await httpClient.get<Planet>(`${BASE_URL}/api/planets/1`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', 1);
      expect(response.data!.name).toBeDefined();
    });

    test('should return 404 for non-existent planet', async ({ httpClient }) => {
      const response: TResponse<Planet[]> = await httpClient.get(`${BASE_URL}/api/planets/999999`);

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });

  test.describe('GET /api/planets/galaxy/{galaxyId}', () => {
    test('should return planets filtered by galaxy', async ({ httpClient }) => {
      const response: TResponse<Planet[]> = await httpClient.get<Planet[]>(`${BASE_URL}/api/planets/galaxy/1`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);

      // All returned planets should belong to galaxy 1
      response.data!.forEach(planet => {
        expect(planet.galaxyId).toBe(1);
      });
    });
  });

  test.describe('GET /api/planets/type/{type}', () => {
    test('should return planets filtered by type', async ({ httpClient }) => {
      const response: TResponse<Planet[]> = await httpClient.get<Planet[]>(`${BASE_URL}/api/planets/type/Terrestrial`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);

      // All returned planets should be Terrestrial type
      response.data!.forEach(planet => {
        expect(planet.type).toBe('Terrestrial');
      });
    });
  });

  test.describe('GET /api/planets/with-atmosphere', () => {
    test('should return only planets with atmosphere', async ({ httpClient }) => {
      const response: TResponse<Planet[]> = await httpClient.get<Planet[]>(`${BASE_URL}/api/planets/with-atmosphere`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);

      // All returned planets should have atmosphere
      response.data!.forEach(planet => {
        expect(planet.hasAtmosphere).toBe(true);
      });
    });
  });

  test.describe('PUT /api/planets/{id}', () => {
    test('should update an existing planet', async ({ httpClient }) => {
      // Create a planet first
      const newPlanet: Planet = {
        name: `Kepler-452b For Update ${Date.now()}`,
        type: 'Exoplanet',
        mass: 5.0,
        radius: 6371,
        distanceFromStar: 1400,
        galaxyId: 1,
        hasAtmosphere: true
      };

      const createResponse: TResponse<Planet> = await httpClient.post<Planet>(`${BASE_URL}/api/planets`, newPlanet);
      expect(createResponse.status).toBe(201);
      const planetId = createResponse.data!.id!;

      // Now update it
      const updatedPlanet: Planet = {
        id: planetId,
        name: `Kepler-452b Updated ${Date.now()}`,
        type: 'Super-Earth',
        mass: 5.5,
        radius: 6500,
        distanceFromStar: 1402,
        galaxyId: 1,
        hasAtmosphere: true
      };

      const response: TResponse<Planet> = await httpClient.put<Planet>(
        `${BASE_URL}/api/planets/${planetId}`,
        updatedPlanet
      );

      expect(response.status).toBe(200);
    });

    test('should return 404 when updating non-existent planet', async ({ httpClient }) => {
      const updatedPlanet: Planet = {
        id: 999999,
        name: 'Non-existent',
        type: 'Unknown',
        mass: 0,
        radius: 0,
        distanceFromStar: 0,
        galaxyId: 1,
        hasAtmosphere: false
      };

      const response: TResponse<Planet> = await httpClient.put(
        `${BASE_URL}/api/planets/999999`,
        updatedPlanet
      );

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });

  test.describe('DELETE /api/planets/{id}', () => {
    test('should delete a planet', async ({ httpClient }) => {
      // Create a planet first
      const newPlanet: Planet = {
        name: `Kepler-452b For Delete ${Date.now()}`,
        type: 'Exoplanet',
        mass: 5.0,
        radius: 6371,
        distanceFromStar: 1400,
        galaxyId: 1,
        hasAtmosphere: true
      };

      const createResponse: TResponse<Planet> = await httpClient.post<Planet>(`${BASE_URL}/api/planets`, newPlanet);
      expect(createResponse.status).toBe(201);
      const planetId = createResponse.data!.id!;

      // Now delete it
      const response: TResponse<void> = await httpClient.delete(`${BASE_URL}/api/planets/${planetId}`);

      expect(response.status).toBe(204);

      // Verify planet was deleted
      const getResponse: TResponse<Planet[]> = await httpClient.get(`${BASE_URL}/api/planets/${planetId}`);
      expect(getResponse.isClientError).toBe(true);
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 when deleting non-existent planet', async ({ httpClient }) => {
      const response: TResponse<void> = await httpClient.delete(`${BASE_URL}/api/planets/999999`);

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });
});
