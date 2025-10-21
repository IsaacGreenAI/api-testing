# api-testing
🚀 API Testing Framework

A modern API testing framework showcasing multiple testing frameworks (**Vitest**, **Playwright** (WIP), **Mocha/Chai** (WIP)) with **SOLID principles**, **ESM modules**, and **production-ready utilities**.

## ✨ Key Features

- **🎯 Multiple Testing Frameworks** - Vitest, Playwright, and Mocha/Chai implementations
- **🏗️ SOLID Principles** - Interface-based HTTP client with Axios and Fetch implementations
- **📦 ES Modules (ESM)** - Modern JavaScript with full ESM support
- **🧪 Comprehensive Test Coverage** - 90+ passing unit and integration tests
- **🛠️ Production-Ready Utilities** - Standalone commons library with HTTP clients, auth factory, and utilities (59 unit tests)
- **🌌 Universe Service API** - RESTful microservice for testing (ASP.NET Core + PostgreSQL)

## 🚀 Quick Start

### Run Tests

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
cd UniverseService.Tests/UniverseService.Tests
dotnet test
```

## 📚 Documentation

- **[vitest-api-tests/README.md](vitest-api-tests/README.md)** - Integration tests with Vitest
- **[commons/README.md](commons/README.md)** - Shared utilities library with unit tests
- **[UniverseService/README.md](UniverseService/README.md)** - Universe Service API documentation