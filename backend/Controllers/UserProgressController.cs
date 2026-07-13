using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProgressController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserProgressController(AppDbContext context)
    {
        _context = context;
    }

    // [Read] Get a user's progress (points, streak, etc.) by username
    [HttpGet("{userName}")]
    public async Task<ActionResult<UserProgress>> GetProgress(string userName)
    {
        var progress = await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserName == userName);

        if (progress == null)
        {
            return NotFound();
        }

        return progress;
    }
}
