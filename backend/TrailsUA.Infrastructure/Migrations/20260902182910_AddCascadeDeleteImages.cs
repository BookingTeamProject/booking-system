using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrailsUA.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Routes_RouteId",
                table: "Images");

            migrationBuilder.AddColumn<Guid>(
                name: "RouteId1",
                table: "Images",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_RouteId1",
                table: "Images",
                column: "RouteId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Routes_RouteId",
                table: "Images",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Routes_RouteId1",
                table: "Images",
                column: "RouteId1",
                principalTable: "Routes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Routes_RouteId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_Routes_RouteId1",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_RouteId1",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "RouteId1",
                table: "Images");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Routes_RouteId",
                table: "Images",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id");
        }
    }
}
