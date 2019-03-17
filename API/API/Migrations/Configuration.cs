namespace API.Migrations {
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<Database.DataContext> {
        public Configuration() {
            AutomaticMigrationsEnabled = true;
        }
    }
}
