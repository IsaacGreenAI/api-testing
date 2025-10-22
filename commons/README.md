# Commons Library

Shared utilities and HTTP clients for API testing across multiple frameworks.

## Features

- ✅ **HTTP Clients** - Interface-based clients (Axios, Fetch & Playwright implementations)
- ✅ **Authorization** - Fluent API for building auth headers (Basic, Bearer, Custom)
- ✅ **Utilities** - Retry logic, sleep, URL builder, date formatting, regex patterns
- ✅ **ES Modules** - Full ESM support with TypeScript
- ✅ **Well Tested** - 75 unit tests with Vitest

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are located in `commons-tests/`:

```
commons/
├── commons-tests/              # Unit tests (75 tests)
│   ├── AxiosHttpClient.test.ts
│   ├── FetchHttpClient.test.ts
│   ├── PlaywrightHttpClient.test.ts
│   ├── authorization-headers-factory.test.ts
│   ├── format-date.test.ts
│   ├── regex-matches.test.ts
│   ├── retry.test.ts
│   ├── sleep.test.ts
│   └── url-builder.test.ts
├── http-client/                # HTTP client implementations
│   ├── IHttpClient.ts
│   ├── TResponse.ts
│   ├── AxiosHttpClient.ts
│   ├── FetchHttpClient.ts
│   └── PlaywrightHttpClient.ts
├── authorization-headers-factory.ts
├── format-date.ts
├── regex-matches.ts
├── retry.ts
├── sleep.ts
├── url-builder.ts
├── index.ts                    # Barrel exports
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

## Usage Examples

### HTTP Clients

```typescript
import { AxiosHttpClient, FetchHttpClient, PlaywrightHttpClient } from './index.js';

// Using Axios
const axiosClient = new AxiosHttpClient();
const response1 = await axiosClient.get('https://api.example.com/data');

// Using Fetch
const fetchClient = new FetchHttpClient();
const response2 = await fetchClient.post('https://api.example.com/data', { name: 'test' });

// Using Playwright (with request fixture from @playwright/test)
import { test } from '@playwright/test';

test('API test with Playwright client', async ({ request }) => {
  const playwrightClient = new PlaywrightHttpClient(request);
  const response = await playwrightClient.get('https://api.example.com/data');

  // All implementations return TResponse<T> with helper methods
  if (response.isSuccess) {
    console.log(response.data);
  }
});
```

### Authorization Headers

```typescript
import { AuthorizationHeadersFactory } from './index.js';

const headers = new AuthorizationHeadersFactory()
  .withBearerAuth('my-token')
  .withContentType('application/json')
  .withCustomProperty('X-API-Key', 'secret')
  .build();

// Result: { Authorization: 'Bearer my-token', 'Content-Type': 'application/json', 'X-API-Key': 'secret' }
```

### Utilities

```typescript
import { retry, sleep, urlBuilder, FormatDate } from './index.js';

// Retry with exponential backoff
await retry(async () => {
  return await apiCall();
}, 3, 100);

// Sleep utility
await sleep(1000);

// URL builder
const url = urlBuilder('https://api.example.com/users/:id', { id: 123 });
// Result: 'https://api.example.com/users/123'

// Date formatting
const formatDate = new FormatDate();
const formatted = formatDate.withFormat('MM/dd/yyyy', new Date());
```

## Test Results

```
Test Files  9 passed (9)
Tests      75 passed (75)
Duration   ~1s
```

All tests use Vitest with proper mocking for HTTP clients.

## License

MIT
