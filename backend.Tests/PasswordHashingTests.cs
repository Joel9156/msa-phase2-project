using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Tests;

public class PasswordHashingTests
{
    private readonly PasswordHasher<User> _hasher = new();

    [Fact]
    public void HashPassword_SameInput_ProducesDifferentHashes()
    {
        var user = new User { UserName = "test" };

        var hash1 = _hasher.HashPassword(user, "mypassword123");
        var hash2 = _hasher.HashPassword(user, "mypassword123");

        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void VerifyHashedPassword_CorrectPassword_Succeeds()
    {
        var user = new User { UserName = "test" };
        var hash = _hasher.HashPassword(user, "mypassword123");

        var result = _hasher.VerifyHashedPassword(user, hash, "mypassword123");

        Assert.Equal(PasswordVerificationResult.Success, result);
    }

    [Fact]
    public void VerifyHashedPassword_WrongPassword_Fails()
    {
        var user = new User { UserName = "test" };
        var hash = _hasher.HashPassword(user, "mypassword123");

        var result = _hasher.VerifyHashedPassword(user, hash, "wrongpassword");

        Assert.Equal(PasswordVerificationResult.Failed, result);
    }
}
