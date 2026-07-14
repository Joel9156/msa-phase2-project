using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserProgressController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserProgressController(AppDbContext context)
    {
        _context = context;
    }

    // [Read] Get the logged-in user's own progress (points, streak, etc.)
    [HttpGet("me")]
    public async Task<ActionResult<UserProgress>> GetProgress()
    {
        var userName = User.Identity!.Name!;
        var progress = await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserName == userName);

        if (progress == null)
        {
            return NotFound();
        }

        return progress;
    }
}
