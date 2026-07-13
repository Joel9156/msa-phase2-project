using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // New table configurations for the Climate Action Walking App
    public DbSet<WalkingRecord> WalkingRecords { get; set; }
    public DbSet<UserProgress> UserProgresses { get; set; }
    public DbSet<QuizQuestion> QuizQuestions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<QuizQuestion>().HasData(
            new QuizQuestion
            {
                Id = 1,
                QuestionText = "What is the main greenhouse gas released by burning fossil fuels?",
                OptionA = "Oxygen",
                OptionB = "Carbon dioxide",
                OptionC = "Nitrogen",
                OptionD = "Helium",
                CorrectOption = "B"
            },
            new QuizQuestion
            {
                Id = 2,
                QuestionText = "Which of these is a renewable energy source?",
                OptionA = "Coal",
                OptionB = "Natural gas",
                OptionC = "Solar power",
                OptionD = "Petroleum",
                CorrectOption = "C"
            },
            new QuizQuestion
            {
                Id = 3,
                QuestionText = "Walking or cycling instead of driving mainly reduces which type of pollution?",
                OptionA = "Noise pollution only",
                OptionB = "Carbon emissions",
                OptionC = "Water pollution",
                OptionD = "Light pollution",
                CorrectOption = "B"
            },
            new QuizQuestion
            {
                Id = 4,
                QuestionText = "What does 'carbon footprint' measure?",
                OptionA = "The number of trees you've planted",
                OptionB = "The total greenhouse gases produced by your activities",
                OptionC = "The distance you've walked",
                OptionD = "The amount of recycling you do",
                CorrectOption = "B"
            },
            new QuizQuestion
            {
                Id = 5,
                QuestionText = "Which everyday habit helps reduce plastic waste the most?",
                OptionA = "Using single-use bottles",
                OptionB = "Using a reusable bottle or cup",
                OptionC = "Buying more plastic bags",
                OptionD = "Leaving the tap running",
                CorrectOption = "B"
            },
            new QuizQuestion
            {
                Id = 6,
                QuestionText = "Which of these best describes 'urban heat island' effect?",
                OptionA = "Cities are cooler than rural areas",
                OptionB = "Cities are warmer than surrounding rural areas due to human activity",
                OptionC = "Islands are heating up faster than cities",
                OptionD = "A type of ocean current",
                CorrectOption = "B"
            }
        );
    }
}