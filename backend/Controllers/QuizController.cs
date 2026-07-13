using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

public class QuizAnswerRequest
{
    public string UserName { get; set; } = string.Empty;
    public int QuestionId { get; set; }
    public string SelectedOption { get; set; } = string.Empty; // "A" | "B" | "C" | "D"
}

[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    private readonly AppDbContext _context;

    private const int DailyGoalSteps = 6000;
    private const int DailyGoalPoints = 10;
    private const double QuizBonusMultiplier = 0.3; // extra 30% on top of today's walking points

    public QuizController(AppDbContext context)
    {
        _context = context;
    }

    // [Read] Get today's quiz question for this user, if they're eligible.
    // A user is only eligible once they've logged a walking record for today,
    // and only once per real day (independent of any WalkingRecord.Date values).
    [HttpGet("today")]
    public async Task<ActionResult> GetTodayQuiz(string userName)
    {
        var today = DateTime.UtcNow.Date;

        var todayRecord = await _context.WalkingRecords
            .FirstOrDefaultAsync(r => r.UserName == userName && r.Date == today);

        if (todayRecord == null)
        {
            return Ok(new { status = "no_walk_logged" });
        }

        var progress = await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserName == userName);

        if (progress != null && progress.LastQuizDate == today)
        {
            return Ok(new { status = "already_completed" });
        }

        var questionCount = await _context.QuizQuestions.CountAsync();
        if (questionCount == 0)
        {
            return Ok(new { status = "no_questions_available" });
        }

        var todayIndex = today.DayOfYear % questionCount;
        var question = await _context.QuizQuestions
            .OrderBy(q => q.Id)
            .Skip(todayIndex)
            .FirstAsync();

        return Ok(new
        {
            status = "ready",
            question = new
            {
                question.Id,
                question.QuestionText,
                question.OptionA,
                question.OptionB,
                question.OptionC,
                question.OptionD
            }
        });
    }

    // [Create] Submit today's answer. One attempt per real day, regardless of
    // whether it's correct.
    [HttpPost("answer")]
    public async Task<ActionResult> SubmitAnswer(QuizAnswerRequest request)
    {
        var today = DateTime.UtcNow.Date;

        var todayRecord = await _context.WalkingRecords
            .FirstOrDefaultAsync(r => r.UserName == request.UserName && r.Date == today);

        if (todayRecord == null)
        {
            return BadRequest(new { message = "Log today's walk before answering the quiz." });
        }

        var progress = await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserName == request.UserName);

        if (progress == null)
        {
            progress = new UserProgress { UserName = request.UserName };
            _context.UserProgresses.Add(progress);
        }

        if (progress.LastQuizDate == today)
        {
            return BadRequest(new { message = "Already answered today's quiz." });
        }

        var question = await _context.QuizQuestions.FindAsync(request.QuestionId);
        if (question == null)
        {
            return NotFound();
        }

        var isCorrect = string.Equals(question.CorrectOption, request.SelectedOption, StringComparison.OrdinalIgnoreCase);
        var bonusPoints = 0;

        if (isCorrect && todayRecord.Steps >= DailyGoalSteps)
        {
            bonusPoints = (int)Math.Round(DailyGoalPoints * QuizBonusMultiplier);
            progress.TotalPoints += bonusPoints;
        }

        progress.LastQuizDate = today;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            correct = isCorrect,
            bonusPoints,
            correctOption = question.CorrectOption
        });
    }
}
