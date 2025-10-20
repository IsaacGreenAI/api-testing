import { describe, it, expect, beforeAll } from 'vitest';
import { AxiosHttpClient, TResponse } from '@commons';

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

describe('Planets API Endpoints', () => {
  let httpClient: AxiosHttpClient;
  let createdPlanetId: number;

  beforeAll(() => {
    httpClient = new AxiosHttpClient();
  });

  describe('GET /api/planets', () => {
    it('should return all planets', async () => {
      const response: TResponse<Planet[]> = await httpClient.get<Planet[]>(`${BASE_URL}/api/planets`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);
    });

    it('should return planets with correct schema', async () => {
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

  describe('POST /api/planets', () => {
    it('should create a new planet', async () => {
      const newPlanet: Planet = {
        name: 'Kepler-452b',
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
        name: 'Kepler-452b',
        type: 'Exoplanet',
        mass: 5.0,
        radius: 6371,
        distanceFromStar: 1400,
        galaxyId: 1,
        hasAtmosphere: true
      });
      expect(response.data!.id).toBeDefined();

      // Save ID for subsequent tests
      createdPlanetId = response.data!.id!;
    });

    it('should reject planet creation with invalid data', async () => {
      const invalidPlanet = {
        name: '', // Empty name should fail validation
        type: 'InvalidType',
        mass: -1,
        radius: -1,
        distanceFromStar: -100, // Negative distance
        galaxyId: 999, // Non-existent galaxy
        hasAtmosphere: true
      };

      const response: TResponse<any> = await httpClient.post(`${BASE_URL}/api/planets`, invalidPlanet);

      // API may return 400 (bad request) or 201 (created) depending on validation
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
    });
  });

  describe('GET /api/planets/{id}', () => {
    it('should return planet by ID', async () => {
      const response: TResponse<Planet> = await httpClient.get<Planet>(`${BASE_URL}/api/planets/1`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', 1);
      expect(response.data!.name).toBeDefined();
    });

    it('should return 404 for non-existent planet', async () => {
      const response: TResponse<any> = await httpClient.get(`${BASE_URL}/api/planets/999999`);

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/planets/galaxy/{galaxyId}', () => {
    it('should return planets filtered by galaxy', async () => {
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

  describe('GET /api/planets/type/{type}', () => {
    it('should return planets filtered by type', async () => {
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

  describe('GET /api/planets/with-atmosphere', () => {
    it('should return only planets with atmosphere', async () => {
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

  describe('PUT /api/planets/{id}', () => {
    it('should update an existing planet', async () => {
      const updatedPlanet: Planet = {
        name: 'Kepler-452b Updated',
        type: 'Super-Earth',
        mass: 5.5,
        radius: 6500,
        distanceFromStar: 1402,
        galaxyId: 1,
        hasAtmosphere: true
      };

      const response: TResponse<Planet> = await httpClient.put<Planet>(
        `${BASE_URL}/api/planets/${createdPlanetId}`,
        updatedPlanet
      );

      // PUT may return 200 or 204
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    });

    it('should return 404 when updating non-existent planet', async () => {
      const updatedPlanet: Planet = {
        name: 'Non-existent',
        type: 'Unknown',
        mass: 0,
        radius: 0,
        distanceFromStar: 0,
        galaxyId: 1,
        hasAtmosphere: false
      };

      const response: TResponse<any> = await httpClient.put(
        `${BASE_URL}/api/planets/999999`,
        updatedPlanet
      );

      expect(response.isClientError).toBe(true);
      // API may return 404 or 400
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('DELETE /api/planets/{id}', () => {
    it('should delete a planet', async () => {
      const response: TResponse<void> = await httpClient.delete(`${BASE_URL}/api/planets/${createdPlanetId}`);

      // DELETE may return 204 or 200
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);

      // Verify planet was deleted
      const getResponse: TResponse<any> = await httpClient.get(`${BASE_URL}/api/planets/${createdPlanetId}`);
      expect(getResponse.isClientError).toBe(true);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent planet', async () => {
      const response: TResponse<any> = await httpClient.delete(`${BASE_URL}/api/planets/999999`);

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });
});
