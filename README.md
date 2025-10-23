# api-testing
🚀 API Testing Framework

A modern API testing framework showcasing multiple testing frameworks (**Playwright**, **Vitest**) with **SOLID principles**, **ESM modules**, and **production-ready utilities**.

## ✨ Key Features

- **🎯 Multiple Testing Frameworks** - Playwright and Vitest implementations for comprehensive API testing
- **🏗️ SOLID Principles** - Interface-based HTTP client with Axios, Fetch, and Playwright implementations
- **📦 ES Modules (ESM)** - Modern JavaScript with full ESM support
- **🧪 Comprehensive Test Coverage**
  - Playwright API Tests - Full integration test suite
  - Vitest API Tests - Full integration test suite
  - Commons Library - Complete unit test coverage
  - Universe Service - Complete service & repository tests
- **🛠️ Production-Ready Utilities** - Standalone commons library with HTTP clients, auth factory, and utilities
- **🌌 Universe Service API** - RESTful microservice for testing (ASP.NET Core + PostgreSQL)

## 🚀 Quick Start

### Run Tests

> **⚠️ Important**: Both Playwright and Vitest projects depend on the `commons` library. You must install commons dependencies first before running these test projects.

**Install Commons Dependencies (Required)**
```bash
cd commons
npm install
```

**Playwright API Tests**
```bash
cd playwright-api-tests
npm install
npm test
npm run test:ui      # Interactive UI mode
npm run test:report  # View HTML report
```

**Integration Tests (Vitest)**
```bash
cd vitest-api-tests
npm install
npm test
npm run test:coverage  # Generate coverage report
```

**Unit Tests (Commons Library)**
```bash
cd commons
npm install
npm test
npm run test:coverage  # Generate coverage report
```

### Run Universe Service

**Start the API**
```bash
cd UniverseService
docker-compose up --build
# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger
```

**Run .NET Unit Tests**
```bash

cd UniverseService.Tests
dotnet test
```

## ✅ Test Coverage

Comprehensive test coverage across the entire repository:

| Project | Framework | Coverage | Status |
|---------|-----------|----------|--------|
| **Commons Library** | Vitest | Unit tests for all utilities and HTTP clients | ✅ All Passing |
| **Vitest API Tests** | Vitest | Full API integration test suite | ✅ All Passing |
| **Playwright API Tests** | Playwright | Full API integration test suite | ✅ All Passing |
| **Universe Service** | xUnit (.NET) | Complete service & repository layer tests | ✅ All Passing |

**Test Suites**: Health checks, CRUD operations, filtering, querying, error handling, and edge cases
**Prerequisites for API Tests**: Universe Service must be running (`docker-compose up --build` in UniverseService directory)

## 🔄 CI Pipeline

This repository includes a comprehensive CI pipeline using GitHub Actions that runs on every pull request to `main`:

### What the CI Pipeline Does

- **✅ Runs all test suites** across 4 frameworks in parallel
- **✅ Validates health checks** for containerized services
- **✅ Blocks PR merging** until all tests pass

### Pipeline Jobs

1. **Commons Library Tests** - Vitest unit tests for shared utilities
2. **.NET Unit Tests** - xUnit tests for UniverseService
3. **API Integration Tests** - Spins up Docker Compose and runs:
   - Vitest API integration tests
   - Playwright API integration tests
4. **Summary Job** - Ensures all tests passed

### Pipeline Features

- **Parallel execution** - All test jobs run simultaneously for fast feedback (~5-8 min)
- **Smart caching** - Node modules and NuGet packages cached between runs
- **Docker integration** - Builds and tests containerized services with health checks
- **Database testing** - PostgreSQL service for integration tests
- **No secrets required** - CI runs entirely with public dependencies

### Local CI Simulation

To run tests locally (simulates the CI pipeline):

```bash
# Terminal 1: Start Universe Service
cd UniverseService
docker-compose up --build

# Terminal 2: Run all tests
cd commons && npm test
cd ../UniverseService.Tests && dotnet test
cd ../vitest-api-tests && npm test
cd ../playwright-api-tests && npx playwright test
```

### Branch Protection

Pull requests to `main` require all CI tests to pass before merging. See [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md) for setup instructions.

## �📚 Documentation

- **[playwright-api-tests/README.md](playwright-api-tests/README.md)** - Playwright API integration tests
- **[vitest-api-tests/README.md](vitest-api-tests/README.md)** - Vitest API integration tests
- **[commons/README.md](commons/README.md)** - Shared utilities library with complete unit tests
- **[UniverseService/README.md](UniverseService/README.md)** - Universe Service API documentation