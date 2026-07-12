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
    
    // Indicates if the daily climate quiz is completed (limited to 1 per day)
    public bool HasCompletedTodayQuiz { get; set; }
}