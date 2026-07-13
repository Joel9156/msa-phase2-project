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

        // 2. Save changes to the actual app.db file
        await _context.SaveChangesAsync();

        // 3. Return 201 Created status with the saved record data
        return CreatedAtAction(nameof(GetRecord), new { id = record.Id }, record);
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