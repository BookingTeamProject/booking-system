using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrailsUA.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBookings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaxGuests",
                table: "Routes",
                type: "integer",
                nullable: false,
                defaultValue: 4);

            migrationBuilder.DropForeignKey(name: "FK_Bookings_Routes_RouteId", table: "Bookings");
            migrationBuilder.DropForeignKey(name: "FK_Bookings_Users_GuestId", table: "Bookings");
            migrationBuilder.DropIndex(name: "IX_Bookings_RouteId", table: "Bookings");

            migrationBuilder.AlterColumn<DateOnly>(name: "CheckIn", table: "Bookings", type: "date", nullable: false,
                oldClrType: typeof(DateTime), oldType: "timestamp with time zone");
            migrationBuilder.AlterColumn<DateOnly>(name: "CheckOut", table: "Bookings", type: "date", nullable: false,
                oldClrType: typeof(DateTime), oldType: "timestamp with time zone");
            migrationBuilder.AlterColumn<decimal>(name: "TotalPrice", table: "Bookings", type: "numeric(12,2)", precision: 12, scale: 2, nullable: false,
                oldClrType: typeof(decimal), oldType: "numeric");
            migrationBuilder.AlterColumn<string>(name: "Status", table: "Bookings", type: "character varying(20)", maxLength: 20, nullable: false,
                oldClrType: typeof(string), oldType: "text");

            migrationBuilder.AddColumn<int>(name: "Guests", table: "Bookings", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<decimal>(name: "PricePerNight", table: "Bookings", type: "numeric(12,2)", precision: 12, scale: 2, nullable: false, defaultValue: 0m);
            migrationBuilder.AddColumn<decimal>(name: "CleaningFee", table: "Bookings", type: "numeric(12,2)", precision: 12, scale: 2, nullable: false, defaultValue: 0m);
            migrationBuilder.AddColumn<decimal>(name: "ServiceFee", table: "Bookings", type: "numeric(12,2)", precision: 12, scale: 2, nullable: false, defaultValue: 0m);
            migrationBuilder.AddColumn<string>(name: "CancellationReason", table: "Bookings", type: "character varying(1000)", maxLength: 1000, nullable: true);

            migrationBuilder.Sql("UPDATE \"Bookings\" SET \"Status\" = 'Confirmed' WHERE \"Status\" = 'Approved';");
            migrationBuilder.AddCheckConstraint(name: "CK_Bookings_Dates", table: "Bookings", sql: "\"CheckOut\" > \"CheckIn\"");
            migrationBuilder.AddCheckConstraint(name: "CK_Bookings_Guests", table: "Bookings", sql: "\"Guests\" > 0");
            migrationBuilder.AddCheckConstraint(name: "CK_Bookings_TotalPrice", table: "Bookings", sql: "\"TotalPrice\" > 0");
            migrationBuilder.AddForeignKey(name: "FK_Bookings_Routes_RouteId", table: "Bookings", column: "RouteId", principalTable: "Routes", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(name: "FK_Bookings_Users_GuestId", table: "Bookings", column: "GuestId", principalTable: "Users", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
            migrationBuilder.CreateIndex(name: "IX_Bookings_RouteId_CheckIn_CheckOut", table: "Bookings", columns: new[] { "RouteId", "CheckIn", "CheckOut" });
            migrationBuilder.Sql("""
                CREATE EXTENSION IF NOT EXISTS btree_gist;
                ALTER TABLE "Bookings" ADD CONSTRAINT "EX_Bookings_NoOverlap"
                EXCLUDE USING gist (
                    "RouteId" WITH =,
                    daterange("CheckIn", "CheckOut", '[)') WITH &&
                ) WHERE ("Status" IN ('Pending', 'Confirmed'));
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"Bookings\" DROP CONSTRAINT IF EXISTS \"EX_Bookings_NoOverlap\";");
            migrationBuilder.DropCheckConstraint(name: "CK_Bookings_Dates", table: "Bookings");
            migrationBuilder.DropCheckConstraint(name: "CK_Bookings_Guests", table: "Bookings");
            migrationBuilder.DropCheckConstraint(name: "CK_Bookings_TotalPrice", table: "Bookings");
            migrationBuilder.DropIndex(name: "IX_Bookings_RouteId_CheckIn_CheckOut", table: "Bookings");
            migrationBuilder.DropColumn(name: "Guests", table: "Bookings");
            migrationBuilder.DropColumn(name: "PricePerNight", table: "Bookings");
            migrationBuilder.DropColumn(name: "CleaningFee", table: "Bookings");
            migrationBuilder.DropColumn(name: "ServiceFee", table: "Bookings");
            migrationBuilder.DropColumn(name: "CancellationReason", table: "Bookings");
            migrationBuilder.DropColumn(name: "MaxGuests", table: "Routes");
        }
    }
}
