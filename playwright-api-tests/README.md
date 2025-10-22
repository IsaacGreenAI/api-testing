# Playwright API Tests

Modern API testing with Playwright Test, showcasing SOLID principles and ES Modules.

## Features

- **Playwright Test** - Modern test framework with native API testing
- **ES Modules** - Full ESM support with `.ts` extensions
- **PlaywrightHttpClient** - Native Playwright APIRequestContext implementation
- **Custom Fixtures** - Dependency injection pattern for httpClient
- **Comprehensive Tests** - Full API integration test suite

## Installation

```bash
npm install
```

## Running Tests

```bash
npm test              # Run all tests
npm run test:ui       # UI mode
npm run test:debug    # Debug mode
npm run test:report   # View HTML report
```

**Prerequisites**: Universe Service must be running at `http://localhost:8080`

```bash
cd ../UniverseService
docker-compose up --build
```

## Project Structure

```
playwright-api-tests/
├── specs/                     # Integration tests
│   ├── health.spec.ts        # Health check tests
│   ├── planets.spec.ts       # Planets CRUD tests
│   └── galaxies.spec.ts      # Galaxies CRUD tests
├── fixtures/
│   └── httpClient.fixture.ts # Custom fixture
└── playwright.config.ts
```

## Custom Fixtures

```typescript
// fixtures/httpClient.fixture.ts
import { test as base } from '@playwright/test';
import { PlaywrightHttpClient } from '@commons/http-client/PlaywrightHttpClient.ts';

export const test = base.extend<{ httpClient: PlaywrightHttpClient }>({
  httpClient: async ({ request }, use) => {
    const client = new PlaywrightHttpClient(request);
    await use(client);
  },
});
```

## Usage Example

```typescript
import { test } from '../fixtures/httpClient.fixture.ts';
import { expect } from '@playwright/test';

test('Get all planets', async ({ httpClient }) => {
  const response = await httpClient.get('http://localhost:8080/api/planets');
  expect(response.isSuccess).toBe(true);
});
```

## ESM Configuration

All imports must use `.ts` extensions:

```typescript
// Correct
import { PlaywrightHttpClient } from '@commons/http-client/PlaywrightHttpClient.ts';

// Incorrect
import { PlaywrightHttpClient } from '@commons/http-client/PlaywrightHttpClient';
```

## Troubleshooting

**Tests failing?**
```bash
# Ensure Universe Service is running
cd ../UniverseService && docker-compose up

# Check API is accessible
curl http://localhost:8080/health
```

**Port in use?**
```bash
cd ../UniverseService
docker-compose down
docker-compose up --build
```

## License

MIT
