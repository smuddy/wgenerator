using API.Database.Model;
using System.Data.Entity;

namespace API.Database {
    public class DataContext : DbContext {
        public DbSet<Song> Songs { get; set; }
        public DbSet<Change> Changes { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<User> Users { get; set; }
    }
}