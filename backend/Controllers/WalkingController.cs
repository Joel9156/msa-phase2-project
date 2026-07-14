using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
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

    // [Read] Get all walking records for the logged-in user, sorted by latest date
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WalkingRecord>>> GetRecords()
    {
        var userName = User.Identity!.Name!;

        return await _context.WalkingRecords
            .Where(r => r.UserName == userName)
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

    // [Create] Add steps to today's record for the logged-in user (creating it
    // if this is their first entry today). Multiple submissions on the same
    // day accumulate instead of overwriting each other.
    [HttpPost]
    public async Task<ActionResult<WalkingRecord>> AddRecord(WalkingRecord record)
    {
        var userName = User.Identity!.Name!;
        var today = DateTime.UtcNow.Date;

        var existing = await _context.WalkingRecords
            .FirstOrDefaultAsync(r => r.UserName == userName && r.Date == today);

        // Did today already cross the daily goal before this submission?
        // Used below so we only award points/streak once per day, the moment
        // the cumulative total first reaches the goal.
        var wasCounted = existing != null && existing.Steps >= DailyGoalSteps;

        if (existing != null)
        {
            existing.Steps += record.Steps;
            record = existing;
        }
        else
        {
            record.UserName = userName;
            record.Date = today;
            _context.WalkingRecords.Add(record);
        }

        await ApplyGamificationRulesAsync(record, wasCounted);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRecord), new { id = record.Id }, record);
    }

    // Awards points/streak progress the moment a day's cumulative steps first
    // cross the daily goal. No-ops if the goal isn't met yet, or was already
    // met earlier today (wasCounted), so repeated submissions on the same day
    // never double-count.
    private async Task ApplyGamificationRulesAsync(WalkingRecord record, bool wasCounted)
    {
        var metDailyGoal = record.Steps >= DailyGoalSteps;

        if (!metDailyGoal || wasCounted)
        {
            return;
        }

        var progress = await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserName == record.UserName);

        if (progress == null)
        {
            progress = new UserProgress { UserName = record.UserName };
            _context.UserProgresses.Add(progress);
        }

        var daysSinceLastActive = (record.Date - progress.LastActiveDate).Days;

        if (daysSinceLastActive == 1)
        {
            progress.CurrentStreak += 1;
        }
        else if (daysSinceLastActive != 0)
        {
            // First-ever goal day, or a gap of more than a day: streak restarts.
            progress.CurrentStreak = 1;
        }
        // daysSinceLastActive == 0 shouldn't happen here since wasCounted would
        // already be true, but is harmless if it does (streak left unchanged).

        progress.TotalPoints += DailyGoalPoints;

        if (progress.CurrentStreak > 0 && progress.CurrentStreak % StreakMilestoneDays == 0)
        {
            progress.TotalPoints += StreakBonusPoints;
        }

        progress.LastActiveDate = record.Date;
    }

    // [Update] Replace an existing walking record (only the owner may do this)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRecord(int id, WalkingRecord record)
    {
        if (id != record.Id)
        {
            return BadRequest();
        }

        var existing = await _context.WalkingRecords.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
        if (existing == null)
        {
            return NotFound();
        }
        if (existing.UserName != User.Identity!.Name)
        {
            return Forbid();
        }

        record.UserName = User.Identity!.Name!;
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

    // [Delete] Remove a walking record (only the owner may do this)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecord(int id)
    {
        var record = await _context.WalkingRecords.FindAsync(id);
        if (record == null)
        {
            return NotFound();
        }
        if (record.UserName != User.Identity!.Name)
        {
            return Forbid();
        }

        _context.WalkingRecords.Remove(record);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
