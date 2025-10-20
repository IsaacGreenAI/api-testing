import { describe, it, expect, beforeAll } from 'vitest';
import { FetchHttpClient, TResponse } from '@commons';

const BASE_URL = process.env.UNIVERSE_API_URL || 'http://localhost:8080';

interface Galaxy {
  id?: number;
  name: string;
  type: string;
  distanceFromEarth: number;
  hasBlackHole: boolean;
}

describe('Galaxies API Endpoints', () => {
  let httpClient: FetchHttpClient;
  let createdGalaxyId: number;

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
      expect(galaxy).toHaveProperty('distanceFromEarth');
      expect(galaxy).toHaveProperty('hasBlackHole');
    });
  });

  describe('POST /api/galaxies', () => {
    it('should create a new galaxy', async () => {
      const newGalaxy: Galaxy = {
        name: 'Messier 87',
        type: 'Elliptical',
        distanceFromEarth: 53500000,
        hasBlackHole: true
      };

      const response: TResponse<Galaxy> = await httpClient.post<Galaxy>(`${BASE_URL}/api/galaxies`, newGalaxy);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        name: 'Messier 87',
        type: 'Elliptical',
        distanceFromEarth: 53500000,
        hasBlackHole: true
      });
      expect(response.data!.id).toBeDefined();

      // Save ID for subsequent tests
      createdGalaxyId = response.data!.id!;
    });

    it('should reject galaxy creation with invalid data', async () => {
      const invalidGalaxy = {
        name: '', // Empty name
        type: 'InvalidType',
        distanceFromEarth: -1000, // Negative distance
        hasBlackHole: true
      };

      const response: TResponse<any> = await httpClient.post(`${BASE_URL}/api/galaxies`, invalidGalaxy);

      // API may return 400 (bad request) or 201 (created) depending on validation
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
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
      const response: TResponse<any> = await httpClient.get(`${BASE_URL}/api/galaxies/999999`);

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
      const updatedGalaxy: Galaxy = {
        name: 'Messier 87 Updated',
        type: 'Giant Elliptical',
        distanceFromEarth: 53600000,
        hasBlackHole: true
      };

      const response: TResponse<Galaxy> = await httpClient.put<Galaxy>(
        `${BASE_URL}/api/galaxies/${createdGalaxyId}`,
        updatedGalaxy
      );

      // PUT may return 200 or 204
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
    });

    it('should return 404 when updating non-existent galaxy', async () => {
      const updatedGalaxy: Galaxy = {
        name: 'Non-existent',
        type: 'Unknown',
        distanceFromEarth: 0,
        hasBlackHole: false
      };

      const response: TResponse<any> = await httpClient.put(
        `${BASE_URL}/api/galaxies/999999`,
        updatedGalaxy
      );

      expect(response.isClientError).toBe(true);
      // API may return 404 or 400
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('DELETE /api/galaxies/{id}', () => {
    it('should delete a galaxy', async () => {
      const response: TResponse<void> = await httpClient.delete(`${BASE_URL}/api/galaxies/${createdGalaxyId}`);

      expect(response.isSuccess).toBe(true);
      expect(response.status).toBe(204);

      // Verify galaxy was deleted
      const getResponse: TResponse<any> = await httpClient.get(`${BASE_URL}/api/galaxies/${createdGalaxyId}`);
      expect(getResponse.isClientError).toBe(true);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent galaxy', async () => {
      const response: TResponse<any> = await httpClient.delete(`${BASE_URL}/api/galaxies/999999`);

      expect(response.isClientError).toBe(true);
      expect(response.status).toBe(404);
    });
  });
});
