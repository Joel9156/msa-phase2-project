using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddQuizFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasCompletedTodayQuiz",
                table: "UserProgresses");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastQuizDate",
                table: "UserProgresses",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "QuizQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    QuestionText = table.Column<string>(type: "TEXT", nullable: false),
                    OptionA = table.Column<string>(type: "TEXT", nullable: false),
                    OptionB = table.Column<string>(type: "TEXT", nullable: false),
                    OptionC = table.Column<string>(type: "TEXT", nullable: false),
                    OptionD = table.Column<string>(type: "TEXT", nullable: false),
                    CorrectOption = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizQuestions", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "QuizQuestions",
                columns: new[] { "Id", "CorrectOption", "OptionA", "OptionB", "OptionC", "OptionD", "QuestionText" },
                values: new object[,]
                {
                    { 1, "B", "Oxygen", "Carbon dioxide", "Nitrogen", "Helium", "What is the main greenhouse gas released by burning fossil fuels?" },
                    { 2, "C", "Coal", "Natural gas", "Solar power", "Petroleum", "Which of these is a renewable energy source?" },
                    { 3, "B", "Noise pollution only", "Carbon emissions", "Water pollution", "Light pollution", "Walking or cycling instead of driving mainly reduces which type of pollution?" },
                    { 4, "B", "The number of trees you've planted", "The total greenhouse gases produced by your activities", "The distance you've walked", "The amount of recycling you do", "What does 'carbon footprint' measure?" },
                    { 5, "B", "Using single-use bottles", "Using a reusable bottle or cup", "Buying more plastic bags", "Leaving the tap running", "Which everyday habit helps reduce plastic waste the most?" },
                    { 6, "B", "Cities are cooler than rural areas", "Cities are warmer than surrounding rural areas due to human activity", "Islands are heating up faster than cities", "A type of ocean current", "Which of these best describes 'urban heat island' effect?" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuizQuestions");

            migrationBuilder.DropColumn(
                name: "LastQuizDate",
                table: "UserProgresses");

            migrationBuilder.AddColumn<bool>(
                name: "HasCompletedTodayQuiz",
                table: "UserProgresses",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
