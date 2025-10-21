# Universe Service API

A RESTful microservice for managing planets and galaxies in the universe, built with ASP.NET Core, PostgreSQL, and Docker.

## Architecture

```
Controller → Service → Repository → Database (PostgreSQL)
```

- **Controllers** - HTTP endpoints and request/response handling
- **Services** - Business logic and orchestration
- **Repositories** - Data access layer with EF Core
- **Models** - Domain entities (Planet, Galaxy)

## Features

- ✅ RESTful API with Swagger/OpenAPI documentation
- ✅ PostgreSQL database with Entity Framework Core
- ✅ Repository Pattern + Service Layer
- ✅ Dependency Injection
- ✅ Health Check endpoint
- ✅ Docker containerization
- ✅ Database migrations with seed data
- ✅ Environment-based configuration

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

### Option 1: Run with Docker Compose (Recommended)

```bash
# Start all services (API + PostgreSQL)
docker-compose up --build

# Access the API
curl http://localhost:8080/health

# View Swagger UI
open http://localhost:8080/swagger
```

### Option 2: Run Locally (without Docker)

```bash
# Start PostgreSQL (update appsettings.json with your connection string)
# Or use Docker for just the database:
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16-alpine

# Run the application
dotnet run

# Access at http://localhost:5000
```

## API Endpoints

### Planets

- `GET /api/planets` - Get all planets
- `GET /api/planets/{id}` - Get planet by ID
- `GET /api/planets/galaxy/{galaxyId}` - Get planets by galaxy
- `GET /api/planets/type/{type}` - Get planets by type
- `GET /api/planets/with-atmosphere` - Get planets with atmosphere
- `POST /api/planets` - Create a new planet
- `PUT /api/planets/{id}` - Update a planet
- `DELETE /api/planets/{id}` - Delete a planet

### Galaxies

- `GET /api/galaxies` - Get all galaxies
- `GET /api/galaxies/{id}` - Get galaxy by ID
- `GET /api/galaxies/type/{type}` - Get galaxies by type
- `GET /api/galaxies/with-blackhole` - Get galaxies with black holes
- `GET /api/galaxies/within-distance/{maxDistance}` - Get nearby galaxies
- `POST /api/galaxies` - Create a new galaxy
- `PUT /api/galaxies/{id}` - Update a galaxy
- `DELETE /api/galaxies/{id}` - Delete a galaxy

### Health

- `GET /health` - Service health check

## Configuration

Environment variables (see `.env` file):

```bash
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=universedb

# Connection String Override
ConnectionStrings__UniverseDatabase=Host=postgres;Port=5432;Database=universedb;Username=postgres;Password=postgres
```

## Development

### Project Structure

```
UniverseService/
├── Controllers/         # API endpoints
├── Services/            # Business logic layer
├── Repositories/        # Data access layer
├── Interfaces/          # Service and repository contracts
├── Models/              # Domain entities
├── Data/                # DbContext and migrations
├── Migrations/          # EF Core migrations
├── Dockerfile           # Container definition
├── docker-compose.yml   # Multi-container orchestration
└── .env                 # Environment variables
```

### Database Migrations

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Remove last migration
dotnet ef migrations remove
```

### Seed Data

The service includes seed data for:
- 5 Galaxies (Milky Way, Andromeda, Triangulum, Large Magellanic Cloud, Sombrero)
- 8 Planets (Our Solar System: Mercury through Neptune)

## Docker Commands

```bash
# Build the image
docker build -t universe-service .

# Run the container
docker run -p 8080:8080 universe-service

# Start with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f universe-api

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Testing

### Running Unit Tests

The service includes a comprehensive test suite using xUnit.

```bash
# Navigate to the test project
cd UniverseService.Tests

# Restore dependencies
dotnet restore

# Run all unit tests
dotnet test

# Run tests with detailed output
dotnet test --verbosity detailed

# Run tests with coverage (requires coverlet)
dotnet test /p:CollectCoverage=true /p:CoverageReportsFormat=cobertura
```

**Test Structure:**
```
UniverseService.Tests/
├── Controllers/          # Controller tests
├── Services/            # Service layer tests
├── Repositories/        # Repository tests
└── UniverseService.Tests.csproj
```

### Manual API Testing

```bash
# Test health endpoint
curl http://localhost:8080/health

# Test API with Swagger UI
open http://localhost:8080/swagger
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Build and Test
  run: dotnet test

- name: Build Docker Image
  run: docker build -t universe-service .

- name: Run Integration Tests
  run: docker-compose up -d && ./run-tests.sh
```

## License

MIT

## Contributing

This is a learning project demonstrating Microsoft microservice best practices.
