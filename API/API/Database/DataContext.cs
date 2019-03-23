using API.Migrations;
using API.Models;
using System.Data.Entity;

namespace API.Database {
    public class DataContext : DbContext {

        public DataContext() : base("DataContext") {
            System.Data.Entity.Database.SetInitializer(new MigrateDatabaseToLatestVersion<DataContext, Configuration>());
        }

        public DbSet<Song> Songs { get; set; }
        public DbSet<Change> Changes { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<API.Models.Log> Logs { get; set; }
    }
}