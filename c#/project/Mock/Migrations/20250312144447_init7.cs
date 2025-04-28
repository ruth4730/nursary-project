using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mock.Migrations
{
    public partial class init7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlantId",
                table: "plantsCharacterization");

            migrationBuilder.AddColumn<int>(
                name: "PlantCharacterizationId",
                table: "plants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_plants_PlantCharacterizationId",
                table: "plants",
                column: "PlantCharacterizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_plants_plantsCharacterization_PlantCharacterizationId",
                table: "plants",
                column: "PlantCharacterizationId",
                principalTable: "plantsCharacterization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_plants_plantsCharacterization_PlantCharacterizationId",
                table: "plants");

            migrationBuilder.DropIndex(
                name: "IX_plants_PlantCharacterizationId",
                table: "plants");

            migrationBuilder.DropColumn(
                name: "PlantCharacterizationId",
                table: "plants");

            migrationBuilder.AddColumn<int>(
                name: "PlantId",
                table: "plantsCharacterization",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
