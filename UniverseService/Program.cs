using Microsoft.EntityFrameworkCore;
using UniverseService.Data;
using UniverseService.Interfaces;
using UniverseService.Repositories;
using UniverseService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext with PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("UniverseDatabase");
builder.Services.AddDbContext<UniverseDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register repositories for Dependency Injection
builder.Services.AddScoped<IPlanetRepository, PlanetRepository>();
builder.Services.AddScoped<IGalaxyRepository, GalaxyRepository>();

// Register services for Dependency Injection
builder.Services.AddScoped<IPlanetService, PlanetService>();
builder.Services.AddScoped<IGalaxyService, GalaxyService>();

// Add Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<UniverseDbContext>("database");

// Add Controllers
builder.Services.AddControllers();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Universe Service API",
        Version = "v1",
        Description = "A RESTful API for managing planets and galaxies in the universe",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Universe Service",
        }
    });
});

var app = builder.Build();

// Apply database migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UniverseDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Universe Service API v1");
    });
}

app.UseAuthorization();

// Map health check endpoint
app.MapHealthChecks("/health");

app.MapControllers();

app.Run();
