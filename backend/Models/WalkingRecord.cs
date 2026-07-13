namespace backend.Models;

public class WalkingRecord
{
    public int Id { get; set; }
    
    // User identifier (for mock login strategy)
    public string UserName { get; set; } = string.Empty;
    
    // Number of steps (e.g., 5000)
    public int Steps { get; set; }
    
    // Points earned from this record (Gamification)
    public int EarnedPoints { get; set; }
    
    // Date of the record
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
}