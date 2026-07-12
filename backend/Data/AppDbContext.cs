using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // New table configurations for the Climate Action Walking App
    public DbSet<WalkingRecord> WalkingRecords { get; set; }
    public DbSet<UserProgress> UserProgresses { get; set; }
}