namespace API.Migrations {
    using System.Data.Entity.Migrations;

    public partial class Init : DbMigration {
        public override void Up() {
            CreateTable(
                "dbo.Changes",
                c => new {
                    ID = c.Int(nullable: false, identity: true),
                    UserId = c.Int(nullable: false),
                    Date = c.DateTime(nullable: false),
                    Comment = c.String(),
                    Song_ID = c.Int(),
                })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.Songs", t => t.Song_ID)
                .Index(t => t.UserId)
                .Index(t => t.Song_ID);

            CreateTable(
                "dbo.Users",
                c => new {
                    ID = c.Int(nullable: false, identity: true),
                    Account = c.String(),
                    Pass = c.String(),
                    Name = c.String(),
                    Surname = c.String(),
                    Email = c.String(),
                    Access = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.ID);

            CreateTable(
                "dbo.Files",
                c => new {
                    ID = c.Int(nullable: false, identity: true),
                    ReferenceFile = c.Guid(nullable: false),
                    Name = c.String(),
                    FileType = c.Int(nullable: false),
                })
                .PrimaryKey(t => t.ID);

            CreateTable(
                "dbo.Songs",
                c => new {
                    ID = c.Int(nullable: false, identity: true),
                    Name = c.String(),
                    Text = c.String(),
                    Comments = c.String(),
                    Key = c.String(),
                    Tempo = c.Int(),
                    SongType = c.Int(nullable: false),
                    Final = c.Boolean(nullable: false),
                })
                .PrimaryKey(t => t.ID);

        }

        public override void Down() {
            DropForeignKey("dbo.Changes", "Song_ID", "dbo.Songs");
            DropForeignKey("dbo.Changes", "UserId", "dbo.Users");
            DropIndex("dbo.Changes", new[] { "Song_ID" });
            DropIndex("dbo.Changes", new[] { "UserId" });
            DropTable("dbo.Songs");
            DropTable("dbo.Files");
            DropTable("dbo.Users");
            DropTable("dbo.Changes");
        }
    }
}
