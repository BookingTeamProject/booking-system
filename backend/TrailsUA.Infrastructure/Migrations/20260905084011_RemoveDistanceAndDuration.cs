using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrailsUA.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDistanceAndDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DistanceKm",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "DurationHours",
                table: "Routes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "DistanceKm",
                table: "Routes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "DurationHours",
                table: "Routes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
