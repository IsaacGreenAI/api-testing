# Vitest API Tests

Modern API testing with Vitest, showcasing SOLID principles and ES Modules.

## Features

- ✅ **Vitest** - Modern, fast test framework (Jest-compatible API)
- ✅ **ES Modules** - Full ESM support with `.js` extensions
- ✅ **SOLID Principles** - Interface-based HTTP client architecture
- ✅ **Multiple HTTP Clients** - Axios and Fetch implementations
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Comprehensive Tests** - 69+ passing tests (unit + integration)

## Project Structure

```
vitest-api-tests/
├── specs/                     # Integration tests for Universe Service API
│   ├── health.spec.ts        # Health check endpoint tests
│   ├── planets.spec.ts       # Planets CRUD operation tests
│   └── galaxies.spec.ts      # Galaxies CRUD operation tests
├── vitest.config.ts          # Vitest configuration with @commons alias
├── eslint.config.mjs         # ESLint 9 flat config
└── package.json              # ESM project ("type": "module")
```

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run all tests (unit + integration)
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage report
npm run test:coverage
```

## Test Organization

### Unit Tests (commons/__tests__/)

Located in `../commons/__tests__/`:
- `AxiosHttpClient.test.ts` - Axios HTTP client tests
- `FetchHttpClient.test.ts` - Fetch HTTP client tests
- `authorization-headers-factory.test.ts` - Auth header builder tests
- `format-date.test.ts` - Date formatting utility tests
- `regex-matches.test.ts` - Regex pattern tests
- `retry.test.ts` - Retry mechanism tests
- `sleep.test.ts` - Sleep utility tests
- `url-builder.test.ts` - URL builder tests

### Integration Tests (specs/)

API integration tests for Universe Service:
- `health.spec.ts` - Health check endpoint (3 tests)
- `planets.spec.ts` - Planets API endpoints (14 tests)
- `galaxies.spec.ts` - Galaxies API endpoints (14 tests)

**Prerequisites**: Universe Service must be running at `http://localhost:8080`

```bash
# Start Universe Service
cd ../universe-service
docker-compose up --build
```

## HTTP Client Architecture (SOLID)

The project demonstrates SOLID principles with two HTTP client implementations:

### Interface (Dependency Inversion)

```typescript
// commons/http-client/IHttpClient.ts
export interface IHttpClient {
  get<T>(url: string, headers?, params?): Promise<TResponse<T>>;
  post<T>(url: string, data?, headers?, params?): Promise<TResponse<T>>;
  // ... other HTTP methods
}
```

### Implementations

**AxiosHttpClient** - Uses axios library (used in planets.spec.ts):
```typescript
import { AxiosHttpClient } from '@commons/http-client/AxiosHttpClient.js';

const client = new AxiosHttpClient();
const response = await client.get('http://api.example.com/planets');
```

**FetchHttpClient** - Uses native fetch API (used in galaxies.spec.ts):
```typescript
import { FetchHttpClient } from '@commons/http-client/FetchHttpClient.js';

const client = new FetchHttpClient();
const response = await client.get('http://api.example.com/galaxies');
```

Both implementations:
- Return `TResponse<T>` with helper methods (`isSuccess`, `isClientError`, `isServerError`)
- Support all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
- Handle errors gracefully
- Support headers and query parameters

## ESM Configuration

This project uses ES Modules:

1. **package.json**: `"type": "module"`
2. **Import extensions**: All imports use `.js` extensions
3. **Vitest config**: Path alias `@commons` points to root commons folder

```typescript
// ✅ Correct ESM imports
import { AxiosHttpClient } from '@commons/http-client/AxiosHttpClient.js';
import { sleep } from './sleep.js';

// ❌ Incorrect (will fail)
import { AxiosHttpClient } from '@commons/http-client/AxiosHttpClient';
import { sleep } from './sleep';
```

## Environment Variables

```bash
# .env (optional)
UNIVERSE_API_URL=http://localhost:8080
```

## Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

ESLint 9 with flat config (`eslint.config.mjs`):
- TypeScript ESLint recommended rules
- Unused vars with `_` prefix exception
- No explicit `any` warnings

## Test Results

**Expected Output** (all tests passing):
```
✓ specs/health.spec.ts (3 tests)
✓ specs/planets.spec.ts (14 tests)
✓ specs/galaxies.spec.ts (14 tests)
✓ ../commons/__tests__/authorization-headers-factory.test.ts (7 tests)
✓ ../commons/__tests__/url-builder.test.ts (6 tests)
✓ ../commons/__tests__/regex-matches.test.ts (7 tests)
✓ ../commons/__tests__/retry.test.ts (3 tests)
✓ ../commons/__tests__/sleep.test.ts (1 test)
✓ ../commons/__tests__/format-date.test.ts (26 tests)
✓ ../commons/__tests__/FetchHttpClient.test.ts (10 tests)
✓ ../commons/__tests__/AxiosHttpClient.test.ts (8 tests)

Test Files  11 passed (11)
Tests       99 passed (99)
```

## Troubleshooting

**Integration tests failing?**
- Ensure Universe Service is running: `cd ../universe-service && docker-compose up`
- Check API is accessible: `curl http://localhost:8080/health`

**Import errors?**
- Ensure all imports have `.js` extensions
- Check `@commons` alias in `vitest.config.ts`

**ESLint errors?**
- Run `npm run lint:fix` to auto-fix
- Check `eslint.config.mjs` configuration

## Next Steps

- **Playwright Tests** - Create `playwright-api-tests` folder with Playwright implementation
- **Mocha/Chai Tests** - Create `mocha-api-tests` folder with Mocha/Chai implementation
- **CI/CD Integration** - Add GitHub Actions workflow
- **Coverage Goals** - Maintain >80% code coverage

## License

MIT
