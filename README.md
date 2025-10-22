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

## � CI/CD Pipeline

This repository includes a comprehensive CI/CD pipeline using GitHub Actions that:

- **Runs all test suites** across 4 frameworks
- **Builds Docker images** for the Universe Service
- **Validates health checks** for containerized services
- **Automated deployment** to Docker Hub on main branch pushes

### Pipeline Features

- **Multi-framework testing**: Vitest, Playwright, xUnit, and commons library tests
- **Docker integration**: Builds and tests containerized services
- **Database testing**: PostgreSQL service for integration tests
- **Health validation**: Ensures services start and respond correctly
- **Automated deployment**: Pushes images to Docker Hub on successful builds

### Local CI/CD Simulation

To simulate the CI/CD pipeline locally:

```bash
# Run all tests (simulates CI test job)
npm test  # From commons/
cd ../vitest-api-tests && npm test
cd ../playwright-api-tests && npm install && npx playwright test
cd ../UniverseService.Tests && dotnet test

# Build and test Docker (simulates CI build job)
cd UniverseService
docker-compose build
docker-compose up -d
# Wait for health checks to pass
docker-compose down
```

## �📚 Documentation

- **[playwright-api-tests/README.md](playwright-api-tests/README.md)** - Playwright API integration tests
- **[vitest-api-tests/README.md](vitest-api-tests/README.md)** - Vitest API integration tests
- **[commons/README.md](commons/README.md)** - Shared utilities library with complete unit tests
- **[UniverseService/README.md](UniverseService/README.md)** - Universe Service API documentation