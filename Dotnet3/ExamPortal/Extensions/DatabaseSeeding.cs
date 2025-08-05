using ExamPortal.Data;
using ExamPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamPortal.Extensions
{
    public static class DatabaseSeeding
    {
        public static async Task SeedDatabaseAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ExamPortalDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            try
            {
                // Ensure database is created
                await context.Database.EnsureCreatedAsync();

                // Run any pending migrations
                if ((await context.Database.GetPendingMigrationsAsync()).Any())
                {
                    logger.LogInformation("Applying pending migrations...");
                    await context.Database.MigrateAsync();
                }

                // Seed test users if none exist
                if (!await context.Users.AnyAsync())
                {
                    logger.LogInformation("Seeding test users...");

                    var testUsers = new List<User>
                    {
                        new User
                        {
                            Username = "admin",
                            Email = "admin@example.com",
                            Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
                            FirstName = "Admin",
                            LastName = "User",
                            Role = UserRole.TEACHER,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new User
                        {
                            Username = "teacher",
                            Email = "teacher@example.com",
                            Password = BCrypt.Net.BCrypt.HashPassword("teacher123"),
                            FirstName = "John",
                            LastName = "Teacher",
                            Role = UserRole.TEACHER,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new User
                        {
                            Username = "student",
                            Email = "student@example.com",
                            Password = BCrypt.Net.BCrypt.HashPassword("student123"),
                            FirstName = "Jane",
                            LastName = "Student",
                            Role = UserRole.STUDENT,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new User
                        {
                            Username = "testuser",
                            Email = "test@example.com",
                            Password = BCrypt.Net.BCrypt.HashPassword("password"),
                            FirstName = "Test",
                            LastName = "User",
                            Role = UserRole.STUDENT,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    };

                    await context.Users.AddRangeAsync(testUsers);
                    await context.SaveChangesAsync();

                    logger.LogInformation("Test users seeded successfully!");
                    logger.LogInformation("Available test accounts:");
                    logger.LogInformation("- admin / admin123 (Teacher)");
                    logger.LogInformation("- teacher / teacher123 (Teacher)");
                    logger.LogInformation("- student / student123 (Student)");
                    logger.LogInformation("- testuser / password (Student)");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database");
            }
        }
    }
}
