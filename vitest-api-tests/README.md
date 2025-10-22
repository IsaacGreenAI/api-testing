# Vitest API Tests

Modern API testing with Vitest, showcasing SOLID principles and ES Modules.

## Features

- ✅ **Vitest** - Modern, fast test framework (Jest-compatible API)
- ✅ **ES Modules** - Full ESM support with `.js` extensions
- ✅ **SOLID Principles** - Interface-based HTTP client architecture
- ✅ **FetchHttpClient** - Native fetch API implementation (no external HTTP dependencies)
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Comprehensive Tests** - Full API integration test suite

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

### Integration Tests (specs/)

Complete API integration test coverage for Universe Service:
- `health.spec.ts` - Health check endpoint validation
- `planets.spec.ts` - Complete planets CRUD operations, filtering, and edge cases
- `galaxies.spec.ts` - Complete galaxies CRUD operations, filtering, and edge cases

**Prerequisites**: Universe Service must be running at `http://localhost:8080`

```bash
# Start Universe Service
cd ../UniverseService
docker-compose up --build
```

### Unit Tests

Commons library has its own test suite. See **[../commons/README.md](../commons/README.md)** for details.

```bash
# Run commons unit tests
cd ../commons
npm test
```

## HTTP Client Architecture (SOLID)

This project uses **FetchHttpClient** exclusively, demonstrating the native fetch API implementation.

### Interface (Dependency Inversion)

```typescript
// commons/http-client/IHttpClient.ts
export interface IHttpClient {
  get<T>(url: string, headers?, params?): Promise<TResponse<T>>;
  post<T>(url: string, data?, headers?, params?): Promise<TResponse<T>>;
  // ... other HTTP methods
}
```

### FetchHttpClient Implementation

**FetchHttpClient** - Uses native fetch API (no external dependencies):
```typescript
import { FetchHttpClient, TResponse } from '../../commons';

const client = new FetchHttpClient();
const response = await client.get('http://api.example.com/planets');
```

Features:
- Returns `TResponse<T>` with helper methods (`isSuccess`, `isClientError`, `isServerError`)
- Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
- Handles errors gracefully
- Supports headers and query parameters
- Zero external HTTP library dependencies

## ESM Configuration

This project uses ES Modules:

1. **package.json**: `"type": "module"`
2. **Barrel imports**: Uses `'../../commons'` to import from commons index
3. **Vitest config**: Path alias `@commons` points to `../commons/index.ts`

```typescript
// ✅ Correct - Barrel import from commons
import { FetchHttpClient, TResponse } from '../../commons';

// ✅ Also works - Using @commons alias
import { FetchHttpClient, TResponse } from '@commons';

// ❌ Incorrect - Direct file imports not used in this project
import { FetchHttpClient } from '@commons/http-client/FetchHttpClient.js';
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

**Expected Output** (integration tests):
```
✓ specs/health.spec.ts
✓ specs/planets.spec.ts
✓ specs/galaxies.spec.ts

Test Files  3 passed (3)
Tests      All passed
```

**Note**: Commons unit tests (75+ tests) are run separately in the `../commons` directory.

## Troubleshooting

**Integration tests failing?**
- Ensure Universe Service is running: `cd ../UniverseService && docker-compose up`
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
