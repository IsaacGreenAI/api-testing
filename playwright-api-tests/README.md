# Playwright API Tests

Modern API testing with Playwright Test, showcasing SOLID principles and ES Modules.

## Features

- ✅ **Playwright Test** - Modern, powerful test framework with native API testing support
- ✅ **ES Modules** - Full ESM support with `.ts` extensions
- ✅ **SOLID Principles** - Interface-based HTTP client architecture
- ✅ **PlaywrightHttpClient** - Native Playwright APIRequestContext implementation
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Custom Fixtures** - Dependency injection pattern for httpClient
- ✅ **Comprehensive Tests** - 31 integration tests



## Project Structure

```
playwright-api-tests/
├── specs/                     # Integration tests for Universe Service API
│   ├── health.spec.ts        # Health check endpoint tests
│   ├── planets.spec.ts       # Planets CRUD operation tests
│   └── galaxies.spec.ts      # Galaxies CRUD operation tests
├── fixtures/                  # Custom Playwright fixtures
│   └── httpClient.fixture.ts # PlaywrightHttpClient fixture
├── playwright.config.ts       # Playwright configuration
├── eslint.config.mjs         # ESLint 9 flat config
├── tsconfig.json             # TypeScript config with allowImportingTsExtensions
└── package.json              # ESM project ("type": "module")
```

## Installation



```bash```bash

npm installnpm install

``````



## Running Tests## Running Tests



```bash```bash

# Run all tests# Run all tests

npm testnpm test



# Run tests with UI mode# Run tests with UI mode

npm run test:uinpm run test:ui



# Run tests in headed mode (see browser)# Run tests in headed mode (see browser)

npm run test:headednpm run test:headed



# Debug tests# Debug tests

npm run test:debugnpm run test:debug



# View test report# View test report

npm run test:reportnpm run test:report

``````



## Test Organization## Test Organization



### Integration Tests (specs/)### Integration Tests (specs/)



API integration tests for Universe Service:API integration tests for Universe Service:

- `health.spec.ts` - Health check endpoint (3 tests)- `health.spec.ts` - Health check endpoint (3 tests)

- `planets.spec.ts` - Planets API endpoints (14 tests)- `planets.spec.ts` - Planets API endpoints (14 tests)

- `galaxies.spec.ts` - Galaxies API endpoints (14 tests)- `galaxies.spec.ts` - Galaxies API endpoints (14 tests)



**Prerequisites**: Universe Service must be running at `http://localhost:8080`**Prerequisites**: Universe Service must be running at `http://localhost:8080`



```bash```bash

# Start Universe Service# Start Universe Service

cd ../UniverseServicecd ../UniverseService

docker-compose up --builddocker-compose up --build

``````



### Unit Tests### Unit Tests



Commons library has its own test suite. See **[../commons/README.md](../commons/README.md)** for details.Commons library has its own test suite. See **[../commons/README.md](../commons/README.md)** for details.



```bash```bash

# Run commons unit tests# Run commons unit tests

cd ../commonscd ../commons

npm testnpm test

``````



## HTTP Client Architecture (SOLID)```typescript

// commons/http-client/IHttpClient.ts

This project uses **PlaywrightHttpClient** exclusively, demonstrating Playwright's native API testing capabilities.export interface IHttpClient {

  get<T>(url: string, headers?, params?): Promise<TResponse<T>>;

### Interface (Dependency Inversion)  post<T>(url: string, data?, headers?, params?): Promise<TResponse<T>>;

  // ... other HTTP methods

```typescript}

// commons/http-client/IHttpClient.ts```

export interface IHttpClient {

  get<T>(url: string, headers?, params?): Promise<TResponse<T>>;### PlaywrightHttpClient Implementation

  post<T>(url: string, data?, headers?, params?): Promise<TResponse<T>>;

  // ... other HTTP methods**PlaywrightHttpClient** - Uses Playwright's APIRequestContext (injected via fixture):

}```typescript

```import { test, expect } from '../fixtures/httpClient.fixture.js';



### PlaywrightHttpClient Implementationtest('API test example', async ({ httpClient }) => {

  const response = await httpClient.get('http://api.example.com/planets');

**PlaywrightHttpClient** - Uses Playwright's APIRequestContext (injected via fixture):  expect(response.isSuccess).toBe(true);

```typescript});

import { test, expect } from '../fixtures/httpClient.fixture.ts';```



test('API test example', async ({ httpClient }) => {Features:

  const response = await httpClient.get('http://api.example.com/planets');- Returns `TResponse<T>` with helper methods (`isSuccess`, `isClientError`, `isServerError`)

  expect(response.isSuccess).toBe(true);- Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)

});- Handles errors gracefully

```- Supports headers and query parameters

- Leverages Playwright's built-in request context

Features:

- Returns `TResponse<T>` with helper methods (`isSuccess`, `isClientError`, `isServerError`)## Custom Fixtures

- Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)

- Handles errors gracefullyPlaywright's fixture system provides dependency injection for tests:

- Supports headers and query parameters

- Leverages Playwright's built-in request context```typescript

// fixtures/httpClient.fixture.ts

## Custom Fixturesexport const test = base.extend<{ httpClient: PlaywrightHttpClient }>({

  httpClient: async ({ request }, use) => {

Playwright's fixture system provides dependency injection for tests:    const client = new PlaywrightHttpClient(request);

    await use(client);

```typescript  },

// fixtures/httpClient.fixture.ts});

export const test = base.extend<{ httpClient: PlaywrightHttpClient }>({```

  httpClient: async ({ request }, use) => {

    const client = new PlaywrightHttpClient(request);This pattern:

    await use(client);- Injects `PlaywrightHttpClient` into every test

  },- Ensures proper setup/teardown

});- Enables parallel test execution

```- Follows SOLID principles (Dependency Inversion)



This pattern:## ESM Configuration

- Injects `PlaywrightHttpClient` into every test

- Ensures proper setup/teardownThis project uses ES Modules with TypeScript extensions and the `@commons` alias:

- Enables parallel test execution

- Follows SOLID principles (Dependency Inversion)1. **package.json**: `"type": "module"`

2. **Import extensions**: All imports use `.ts` extensions (not `.js`)

## ESM Configuration3. **TypeScript config**:

   - Enabled `allowImportingTsExtensions` and `noEmit`

This project uses ES Modules with TypeScript extensions and the `@commons` alias:   - `@commons` alias configured in `tsconfig.json` paths

4. **Alias usage**: Import from specific files using `@commons/*` pattern

1. **package.json**: `"type": "module"`

2. **Import extensions**: All imports use `.ts` extensions (not `.js`)```typescript

3. **TypeScript config**:// ✅ Correct: Using @commons alias with specific files and .ts extensions

   - Enabled `allowImportingTsExtensions` and `noEmit`import { PlaywrightHttpClient } from '@commons/http-client/PlaywrightHttpClient.ts';

   - `@commons` alias configured in `tsconfig.json` pathsimport { TResponse } from '@commons/http-client/TResponse.ts';

4. **Alias usage**: Import from specific files using `@commons/*` patternimport { sleep } from '@commons/sleep.ts';

import { urlBuilder } from '@commons/url-builder.ts';

```typescript

// ✅ Correct: Using @commons alias with specific files and .ts extensions// ✅ Also works: Relative imports

import { PlaywrightHttpClient } from '@commons/http-client/PlaywrightHttpClient.ts';import { test, expect } from '../fixtures/httpClient.fixture.ts';

import { TResponse } from '@commons/http-client/TResponse.ts';

import { sleep } from '@commons/sleep.ts';// ❌ Incorrect: Barrel import from index.ts (doesn't work at runtime)

import { urlBuilder } from '@commons/url-builder.ts';import { TResponse, sleep } from '@commons';



// ✅ Also works: Relative imports// ❌ Incorrect: Missing .ts extension

import { test, expect } from '../fixtures/httpClient.fixture.ts';import { TResponse } from '@commons/http-client/TResponse';

```

// ❌ Incorrect: Barrel import from index.ts (doesn't work at runtime)

import { TResponse, sleep } from '@commons';**Why `.ts` extensions?**

- With `allowImportingTsExtensions` enabled, TypeScript allows importing `.ts` files directly

// ❌ Incorrect: Missing .ts extension- Playwright compiles TypeScript on-the-fly and resolves these imports correctly

import { TResponse } from '@commons/http-client/TResponse';- More explicit than the `.js` convention used in compiled projects

```

**Why `@commons/*` pattern instead of `@commons`?**

**Why `.ts` extensions?**- The `index.ts` barrel export uses `.js` extensions (required for ESM when compiled)

- With `allowImportingTsExtensions` enabled, TypeScript allows importing `.ts` files directly- At Playwright runtime, only `.ts` files exist (no compiled `.js` files)

- Playwright compiles TypeScript on-the-fly and resolves these imports correctly- Importing from `@commons` loads `index.ts` which fails to find `.js` files

- More explicit than the `.js` convention used in compiled projects- Using `@commons/file.ts` bypasses the barrel export and works perfectly



**Why `@commons/*` pattern instead of `@commons`?**## Environment Variables

- The `index.ts` barrel export uses `.js` extensions (required for ESM when compiled)

- At Playwright runtime, only `.ts` files exist (no compiled `.js` files)```bash

- Importing from `@commons` loads `index.ts` which fails to find `.js` files# .env (optional)

- Using `@commons/file.ts` bypasses the barrel export and works perfectlyUNIVERSE_API_URL=http://localhost:8080

```

## Environment Variables

## Code Quality

```bash

# .env (optional)```bash

UNIVERSE_API_URL=http://localhost:8080# Lint code

```npm run lint



## Code Quality# Fix linting issues

npm run lint:fix

```bash```

# Lint code

npm run lintESLint 9 with flat config (`eslint.config.mjs`):

- TypeScript ESLint recommended rules

# Fix linting issues- Unused vars with `_` prefix exception

npm run lint:fix- No explicit `any` warnings

```

## Test Results

ESLint 9 with flat config (`eslint.config.mjs`):

- TypeScript ESLint recommended rules**Expected Output** (all tests):

- Unused vars with `_` prefix exception```

- No explicit `any` warnings✓ commons-tests/authorization-headers-factory.test.ts

✓ commons-tests/format-date.test.ts

## Troubleshooting✓ commons-tests/PlaywrightHttpClient.test.ts

✓ commons-tests/regex-matches.test.ts

**Integration tests failing?**✓ commons-tests/retry.test.ts

- Ensure Universe Service is running: `cd ../UniverseService && docker-compose up`✓ commons-tests/sleep.test.ts

- Check API is accessible: `curl http://localhost:8080/health`✓ commons-tests/url-builder.test.ts

✓ commons-tests/alias-poc.test.ts

**Import errors?**✓ specs/health.spec.ts

- Ensure all imports have `.ts` extensions✓ specs/planets.spec.ts

- Check `@commons` alias in `tsconfig.json`✓ specs/galaxies.spec.ts



**ESLint errors?**Test Files  11 passed (11)

- Run `npm run lint:fix` to auto-fixTests      88 passed (88)

- Check `eslint.config.mjs` configuration```



**Playwright installation issues?****Breakdown:**

- Run `npx playwright install` to install browsers- Commons unit tests: 49 tests

- Note: API tests don't require browsers, but Playwright Test needs them installed- API integration tests: 31 tests

- Alias POC tests: 8 tests

## Playwright vs Vitest

**Note**: The same commons utilities are tested in the `../commons` directory with Vitest (75 tests total there).

This project demonstrates Playwright Test for API testing:

- **Fixtures**: Built-in dependency injection## Troubleshooting

- **Parallel execution**: Native support for parallel tests

- **APIRequestContext**: Purpose-built for HTTP testing**Integration tests failing?**

- **Rich reporting**: Built-in HTML reports- Ensure Universe Service is running: `cd ../UniverseService && docker-compose up`

- Check API is accessible: `curl http://localhost:8080/health`

Compare with **vitest-api-tests** which uses FetchHttpClient for a different approach.

**Import errors?**

## Next Steps- Ensure all imports have `.js` extensions

- Check `@commons` alias in `tsconfig.json`

- **Mocha/Chai Tests** - Create `mocha-api-tests` folder with AxiosHttpClient implementation

- **CI/CD Integration** - Add GitHub Actions workflow**ESLint errors?**

- **Coverage Goals** - Maintain >80% code coverage- Run `npm run lint:fix` to auto-fix

- **Visual Regression** - Add Playwright screenshot comparison- Check `eslint.config.mjs` configuration



## License**Playwright installation issues?**

- Run `npx playwright install` to install browsers

MIT- Note: API tests don't require browsers, but Playwright Test needs them installed


## Playwright vs Vitest

This project demonstrates Playwright Test for API testing:
- **Fixtures**: Built-in dependency injection
- **Parallel execution**: Native support for parallel tests
- **APIRequestContext**: Purpose-built for HTTP testing
- **Rich reporting**: Built-in HTML reports

Compare with **vitest-api-tests** which uses FetchHttpClient for a different approach.

## Next Steps

- **Mocha/Chai Tests** - Create `mocha-api-tests` folder with AxiosHttpClient implementation
- **CI/CD Integration** - Add GitHub Actions workflow
- **Coverage Goals** - Maintain >80% code coverage
- **Visual Regression** - Add Playwright screenshot comparison

## License

MIT
