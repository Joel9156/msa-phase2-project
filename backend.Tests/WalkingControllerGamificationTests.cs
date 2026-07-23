using System.Security.Claims;
using backend.Controllers;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests;

public class WalkingControllerGamificationTests
{
    private static WalkingController CreateController(AppDbContext context, string userName)
    {
        var controller = new WalkingController(context);
        var identity = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, userName) }, "TestAuth");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
        };
        return controller;
    }

    private static AppDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task AddRecord_FirstTimeHittingGoal_AwardsPointsAndStartsStreak()
    {
        using var context = CreateInMemoryContext();
        var controller = CreateController(context, "alice");

        await controller.AddRecord(new WalkingRecord { Steps = 6000 });

        var progress = await context.UserProgresses.FirstAsync(p => p.UserName == "alice");
        Assert.Equal(10, progress.TotalPoints);
        Assert.Equal(1, progress.CurrentStreak);
    }

    [Fact]
    public async Task AddRecord_SubmittingTwiceSameDayAfterGoalMet_DoesNotDoublePoints()
    {
        using var context = CreateInMemoryContext();
        var controller = CreateController(context, "bob");

        await controller.AddRecord(new WalkingRecord { Steps = 6000 });
        await controller.AddRecord(new WalkingRecord { Steps = 1000 });

        var progress = await context.UserProgresses.FirstAsync(p => p.UserName == "bob");
        Assert.Equal(10, progress.TotalPoints);
    }

    [Fact]
    public async Task AddRecord_SeventhConsecutiveDay_AwardsStreakBonus()
    {
        using var context = CreateInMemoryContext();
        var yesterday = DateTime.UtcNow.Date.AddDays(-1);

        context.UserProgresses.Add(new UserProgress
        {
            UserName = "carol",
            TotalPoints = 60,
            CurrentStreak = 6,
            LastActiveDate = yesterday
        });
        await context.SaveChangesAsync();

        var controller = CreateController(context, "carol");
        await controller.AddRecord(new WalkingRecord { Steps = 6000 });

        var progress = await context.UserProgresses.FirstAsync(p => p.UserName == "carol");
        Assert.Equal(7, progress.CurrentStreak);
        Assert.Equal(100, progress.TotalPoints); // 60 + 10(daily) + 30(7일 보너스)
    }
}
