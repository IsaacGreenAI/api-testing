import { describe, it, expect, beforeAll } from 'vitest';
import { FetchHttpClient, TResponse } from '../../commons';

const BASE_URL = process.env.UNIVERSE_API_URL || 'http://localhost:8080';

interface Galaxy {
  id?: number;
  name: string;
  type: string;
  starCount: number;
  distanceFromEarth: number;
  diameter: number;
  hasBlackHole: boolean;
}

describe('Galaxies API Endpoints', () => {
  let httpClient: FetchHttpClient;

  beforeAll(() => {
    httpClient = new FetchHttpClient();
  });

  describe('GET /api/galaxies', () => {
    it('should return all galaxies', async () => {
      const response: TResponse<Galaxy[]> = await httpClient.get<Galaxy[]>(`${BASE_URL}/api/galaxies`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);
    });

    it('should return galaxies with correct schema', async () => {
      const response: TResponse<Galaxy[]> = await httpClient.get<Galaxy[]>(`${BASE_URL}/api/galaxies`);

      expect(response.isSuccess).toBe(true);
      const galaxy = response.data![0];
      expect(galaxy).toHaveProperty('id');
      expect(galaxy).toHaveProperty('name');
      expect(galaxy).toHaveProperty('type');
      expect(galaxy).toHaveProperty('starCount');
      expect(galaxy).toHaveProperty('distanceFromEarth');
      expect(galaxy).toHaveProperty('diameter');
      expect(galaxy).toHaveProperty('hasBlackHole');
    });
  });

  describe('POST /api/galaxies', () => {
    it('should create a new galaxy', async () => {
      const newGalaxy: Galaxy = {
        name: `Messier 87 Test ${Date.now()}`,
        type: 'Elliptical',
        starCount: 1000,
        distanceFromEarth: 53500000,
        diameter: 120000,
        hasBlackHole: true
      };

      const response: TResponse<Galaxy> = await httpClient.post<Galaxy>(`${BASE_URL}/api/galaxies`, newGalaxy);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        type: 'Elliptical',
        starCount: 1000,
        distanceFromEarth: 53500000,
        diameter: 120000,
        hasBlackHole: true
      });
      expect(response.data!.name).toContain('Messier 87 Test');
      expect(response.data!.id).toBeDefined();
    });

    it('should reject galaxy creation with invalid data', async () => {
      const invalidGalaxy = {
        name: '', // Empty name - violates MinLength validation
        type: '', // Empty type - violates MinLength validation
        distanceFromEarth: -1000, // Negative distance - violates Range validation
        starCount: -100, // Negative star count - violates Range validation
        diameter: -50, // Negative diameter - violates Range validation
        hasBlackHole: true
      };

      const response: TResponse<Galaxy> = await httpClient.post(`${BASE_URL}/api/galaxies`, invalidGalaxy);

      // API should return 400 Bad Request for validation errors
      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/galaxies/{id}', () => {
    it('should return galaxy by ID', async () => {
      const response: TResponse<Galaxy> = await httpClient.get<Galaxy>(`${BASE_URL}/api/galaxies/1`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', 1);
      expect(response.data!.name).toBeDefined();
    });

    it('should return 404 for non-existent galaxy', async () => {
      const response: TResponse<Galaxy[]> = await httpClient.get(`${BASE_URL}/api/galaxies/999999`);

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/galaxies/type/{type}', () => {
    it('should return galaxies filtered by type', async () => {
      const response: TResponse<Galaxy[]> = await httpClient.get<Galaxy[]>(`${BASE_URL}/api/galaxies/type/Spiral`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);

      // All returned galaxies should be Spiral type
      response.data!.forEach(galaxy => {
        expect(galaxy.type).toBe('Spiral');
      });
    });

    it('should return empty array for non-matching type', async () => {
      const response: TResponse<Galaxy[]> = await httpClient.get<Galaxy[]>(`${BASE_URL}/api/galaxies/type/NonExistentType`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBe(0);
    });
  });

  describe('GET /api/galaxies/with-blackhole', () => {
    it('should return only galaxies with black holes', async () => {
      const response: TResponse<Galaxy[]> = await httpClient.get<Galaxy[]>(`${BASE_URL}/api/galaxies/with-blackhole`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);

      // All returned galaxies should have black holes
      response.data!.forEach(galaxy => {
        expect(galaxy.hasBlackHole).toBe(true);
      });
    });
  });

  describe('GET /api/galaxies/within-distance/{maxDistance}', () => {
    it('should return galaxies within specified distance', async () => {
      const maxDistance = 3000000; // 3 million light years

      const response: TResponse<Galaxy[]> = await httpClient.get<Galaxy[]>(
        `${BASE_URL}/api/galaxies/within-distance/${maxDistance}`
      );

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);

      // All returned galaxies should be within the specified distance
      response.data!.forEach(galaxy => {
        expect(galaxy.distanceFromEarth).toBeLessThanOrEqual(maxDistance);
      });
    });

    it('should return empty or minimal array for very small distance', async () => {
      const maxDistance = 1; // 1 light year (very close)

      const response: TResponse<Galaxy[]> = await httpClient.get<Galaxy[]>(
        `${BASE_URL}/api/galaxies/within-distance/${maxDistance}`
      );

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      // May return empty or very few galaxies
      expect(response.data!.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('PUT /api/galaxies/{id}', () => {
    it('should update an existing galaxy', async () => {
      // Create a galaxy first
      const newGalaxy: Galaxy = {
        name: `Messier 87 For Update ${Date.now()}`,
        type: 'Elliptical',
        starCount: 1000,
        distanceFromEarth: 53500000,
        diameter: 120000,
        hasBlackHole: true
      };

      const createResponse: TResponse<Galaxy> = await httpClient.post<Galaxy>(`${BASE_URL}/api/galaxies`, newGalaxy);
      expect(createResponse.status).toBe(201);
      const galaxyId = createResponse.data!.id!;

      // Now update it
      const updatedGalaxy: Galaxy = {
        id: galaxyId,
        name: `Messier 87 Updated ${Date.now()}`,
        type: 'Giant Elliptical',
        starCount: 1200,
        distanceFromEarth: 53600000,
        diameter: 130000,
        hasBlackHole: true
      };

      const response: TResponse<Galaxy> = await httpClient.put<Galaxy>(
        `${BASE_URL}/api/galaxies/${galaxyId}`,
        updatedGalaxy
      );

      expect(response.status).toBe(200);
    });

    it('should return 404 when updating non-existent galaxy', async () => {
      const updatedGalaxy: Galaxy = {
        id: 999999,
        name: 'Non-existent',
        type: 'Unknown',
        starCount: 0,
        distanceFromEarth: 0,
        diameter: 0,
        hasBlackHole: false
      };

      const response: TResponse<Galaxy> = await httpClient.put(
        `${BASE_URL}/api/galaxies/999999`,
        updatedGalaxy
      );

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/galaxies/{id}', () => {
    it('should delete a galaxy', async () => {
      // Create a galaxy first
      const newGalaxy: Galaxy = {
        name: `Messier 87 For Delete ${Date.now()}`,
        type: 'Elliptical',
        starCount: 1000,
        distanceFromEarth: 53500000,
        diameter: 120000,
        hasBlackHole: true
      };

      const createResponse: TResponse<Galaxy> = await httpClient.post<Galaxy>(`${BASE_URL}/api/galaxies`, newGalaxy);
      expect(createResponse.status).toBe(201);
      const galaxyId = createResponse.data!.id!;

      // Now delete it
      const response: TResponse<void> = await httpClient.delete(`${BASE_URL}/api/galaxies/${galaxyId}`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(204);

      // Verify galaxy was deleted
      const getResponse: TResponse<Galaxy[]> = await httpClient.get(`${BASE_URL}/api/galaxies/${galaxyId}`);
      expect(getResponse.isClientError).toBe(true);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent galaxy', async () => {
      const response: TResponse<void> = await httpClient.delete(`${BASE_URL}/api/galaxies/999999`);

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });
});
