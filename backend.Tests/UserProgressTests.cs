using backend.Models;

namespace backend.Tests;

public class UserProgressTests
{
    [Theory]
    [InlineData(0, "Sprout Walker")]
    [InlineData(99, "Sprout Walker")]
    [InlineData(100, "Green Walker")]
    [InlineData(299, "Green Walker")]
    [InlineData(300, "Earth Keeper")]
    [InlineData(699, "Earth Keeper")]
    [InlineData(700, "Eco Guardian")]
    [InlineData(5000, "Eco Guardian")]
    public void Tier_ReturnsCorrectTierForPoints(int totalPoints, string expectedTier)
    {
        var progress = new UserProgress { TotalPoints = totalPoints };

        Assert.Equal(expectedTier, progress.Tier);
    }
}
