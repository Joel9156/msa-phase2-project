using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models;

public class UserProgress
{
    public int Id { get; set; }

    // User name
    public string UserName { get; set; } = string.Empty;

    // Total accumulated environmental points (used for leaderboard ranking)
    public int TotalPoints { get; set; }

    // Consecutive days of activity (Streak)
    public int CurrentStreak { get; set; }

    // Date of last activity (used for calculating streak)
    public DateTime LastActiveDate { get; set; }

        // Date the user last answered the daily quiz (used to check "already done today")
    public DateTime LastQuizDate { get; set; }


    [NotMapped]
    public string Tier => TotalPoints switch
    {
        >= 700 => "Eco Guardian",
        >= 300 => "Earth Keeper",
        >= 100 => "Green Walker",
        _ => "Sprout Walker"
    };
}