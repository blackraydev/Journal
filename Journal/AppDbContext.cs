using System;
using Journal.Models;
using Microsoft.EntityFrameworkCore;

namespace Journal {
    public class AppDbContext : DbContext {
        public DbSet<Subjects> Subjects { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Groups> Groups { get; set; }
        public DbSet<Students> Students { get; set; }
        public DbSet<TeacherSubjects> TeacherSubjects { get; set; }
        public DbSet<Schedule> Schedule { get; set; }
        public DbSet<Marks> Marks { get; set; }
        public DbSet<Homeworks> Homeworks { get; set; }

        public AppDbContext() {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            optionsBuilder.UseMySql(
                "server=localhost;user=root;password=PASSWORD;database=journal;",
                new MySqlServerVersion(new Version(8, 0, 11))
            );
        }
    }
}