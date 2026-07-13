using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDistanceAndCarbon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarbonSavedKg",
                table: "WalkingRecords");

            migrationBuilder.DropColumn(
                name: "DistanceKm",
                table: "WalkingRecords");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "CarbonSavedKg",
                table: "WalkingRecords",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "DistanceKm",
                table: "WalkingRecords",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
