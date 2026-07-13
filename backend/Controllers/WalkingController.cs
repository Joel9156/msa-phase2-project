using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WalkingController : ControllerBase
{
    private readonly AppDbContext _context;

    private const int DailyGoalSteps = 6000;
    private const int DailyGoalPoints = 10;
    private const int StreakMilestoneDays = 7;
    private const int StreakBonusPoints = 30;

    // Constructor to inject the database context
    public WalkingController(AppDbContext context)
    {
        _context = context;
    }

    // [Read] Get all walking records sorted by latest date
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WalkingRecord>>> GetRecords()
    {
        return await _context.WalkingRecords
        .OrderByDescending(r => r.Date)
        .ToListAsync();
    }

    // [Read] Get a single walking record by id
    [HttpGet("{id}")]
    public async Task<ActionResult<WalkingRecord>> GetRecord(int id)
    {
        var record = await _context.WalkingRecords.FindAsync(id);

        if (record == null)
        {
            return NotFound();
        }

        return record;
    }

    // [Create] Add a new walking record
    [HttpPost]
    public async Task<ActionResult<WalkingRecord>> AddRecord(WalkingRecord record)
    {
        // 1. Add the new record to the database context
        _context.WalkingRecords.Add(record);

        // 2. Update the user's streak/points based on this record
        await ApplyGamificationRulesAsync(record);

        // 3. Save changes to the actual app.db file
        await _context.SaveChangesAsync();

        // 4. Return 201 Created status with the saved record data
        return CreatedAtAction(nameof(GetRecord), new { id = record.Id }, record);
    }

    // Advances the daily streak for record.UserName and awards points for
    // hitting the daily step goal and for reaching a streak milestone.
    // Creates the UserProgress row on the user's first-ever record.
    private async Task ApplyGamificationRulesAsync(WalkingRecord record)
    {
        var progress = await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserName == record.UserName);

        if (progress == null)
        {
            progress = new UserProgress { UserName = record.UserName };
            _context.UserProgresses.Add(progress);
        }

        var daysSinceLastActive = (record.Date - progress.LastActiveDate).Days;
        var metDailyGoal = record.Steps >= DailyGoalSteps;

        if (!metDailyGoal)
        {
            // Missed today's goal: streak breaks.
            progress.CurrentStreak = 0;
        }
        else if (daysSinceLastActive == 1)
        {
            progress.CurrentStreak += 1;
        }
        else if (daysSinceLastActive != 0)
        {
            // First-ever record, or a gap of more than a day: streak restarts.
            progress.CurrentStreak = 1;
        }
        // daysSinceLastActive == 0 (a same-day record) leaves the streak unchanged.

        if (metDailyGoal)
        {
            progress.TotalPoints += DailyGoalPoints;
        }

        if (progress.CurrentStreak > 0 && progress.CurrentStreak % StreakMilestoneDays == 0)
        {
            progress.TotalPoints += StreakBonusPoints;
        }

        progress.LastActiveDate = record.Date;
    }

    // [Update] Replace an existing walking record
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecord(int id, WalkingRecord record)
    {
        if (id != record.Id)
        {
            return BadRequest();
        }

        _context.Entry(record).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            var exists = await _context.WalkingRecords.AnyAsync(r => r.Id == id);
            if (!exists)
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // [Delete] Remove a walking record
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecord(int id)
    {
        var record = await _context.WalkingRecords.FindAsync(id);
        if (record == null)
        {
            return NotFound();
        }

        _context.WalkingRecords.Remove(record);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}