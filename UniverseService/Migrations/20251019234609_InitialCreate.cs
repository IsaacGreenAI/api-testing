using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace UniverseService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Galaxies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StarCount = table.Column<double>(type: "double precision", nullable: false),
                    DistanceFromEarth = table.Column<double>(type: "double precision", nullable: false),
                    Diameter = table.Column<double>(type: "double precision", nullable: false),
                    HasBlackHole = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Galaxies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Planets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Mass = table.Column<double>(type: "double precision", nullable: false),
                    Radius = table.Column<double>(type: "double precision", nullable: false),
                    DistanceFromStar = table.Column<double>(type: "double precision", nullable: false),
                    GalaxyId = table.Column<int>(type: "integer", nullable: true),
                    HasAtmosphere = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Planets", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Galaxies",
                columns: new[] { "Id", "Diameter", "DistanceFromEarth", "HasBlackHole", "Name", "StarCount", "Type" },
                values: new object[,]
                {
                    { 1, 105700.0, 0.0, true, "Milky Way", 400.0, "Spiral" },
                    { 2, 220000.0, 2537000.0, true, "Andromeda", 1000.0, "Spiral" },
                    { 3, 60000.0, 3000000.0, false, "Triangulum", 40.0, "Spiral" },
                    { 4, 14000.0, 163000.0, false, "Large Magellanic Cloud", 30.0, "Irregular" },
                    { 5, 50000.0, 29350000.0, true, "Sombrero Galaxy", 800.0, "Elliptical" }
                });

            migrationBuilder.InsertData(
                table: "Planets",
                columns: new[] { "Id", "DistanceFromStar", "GalaxyId", "HasAtmosphere", "Mass", "Name", "Radius", "Type" },
                values: new object[,]
                {
                    { 1, 0.39000000000000001, 1, false, 0.055, "Mercury", 2439.6999999999998, "Terrestrial" },
                    { 2, 0.71999999999999997, 1, true, 0.81499999999999995, "Venus", 6051.8000000000002, "Terrestrial" },
                    { 3, 1.0, 1, true, 1.0, "Earth", 6371.0, "Terrestrial" },
                    { 4, 1.52, 1, true, 0.107, "Mars", 3389.5, "Terrestrial" },
                    { 5, 5.2000000000000002, 1, true, 317.80000000000001, "Jupiter", 69911.0, "Gas Giant" },
                    { 6, 9.5399999999999991, 1, true, 95.200000000000003, "Saturn", 58232.0, "Gas Giant" },
                    { 7, 19.190000000000001, 1, true, 14.5, "Uranus", 25362.0, "Ice Giant" },
                    { 8, 30.07, 1, true, 17.100000000000001, "Neptune", 24622.0, "Ice Giant" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Galaxies_Name",
                table: "Galaxies",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Planets_Name",
                table: "Planets",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Galaxies");

            migrationBuilder.DropTable(
                name: "Planets");
        }
    }
}
