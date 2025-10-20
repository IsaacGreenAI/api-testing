# api-testing
🚀 Professional API Testing Framework

A modern API testing framework showcasing multiple testing frameworks (**Vitest**, **Playwright**, **Mocha/Chai**) with **SOLID principles**, **ESM modules**, and **production-ready utilities**.

## ✨ Key Features

- **🎯 Multiple Testing Frameworks** - Vitest, Playwright, and Mocha/Chai implementations
- **🏗️ SOLID Principles** - Interface-based HTTP client with Axios and Fetch implementations
- **📦 ES Modules (ESM)** - Modern JavaScript with full ESM support
- **🧪 Comprehensive Test Coverage** - 69+ passing unit and integration tests
- **🛠️ Production-Ready Utilities** - Shared commons library with HTTP clients, auth factory, and utilities
- **🌌 Universe Service API** - RESTful microservice for testing (ASP.NET Core + PostgreSQL)

## 🚀 Quick Start

### Run Vitest Tests

```bash
cd vitest-api-tests
npm install
npm test
npm run test:coverage  # Generate coverage report
```

### Start Universe Service API

```bash
cd universe-service
docker-compose up --build
# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger
```

See **[vitest-api-tests/README.md](vitest-api-tests/README.md)** and **[universe-service/README.md](universe-service/README.md)** for detailed documentation.