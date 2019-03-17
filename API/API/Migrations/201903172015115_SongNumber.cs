namespace API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SongNumber : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Changes", "UserId", "dbo.Users");
            DropForeignKey("dbo.Changes", "Song_ID", "dbo.Songs");
            DropIndex("dbo.Changes", new[] { "UserId" });
            DropIndex("dbo.Changes", new[] { "Song_ID" });
            DropPrimaryKey("dbo.Changes");
            DropPrimaryKey("dbo.Users");
            DropPrimaryKey("dbo.Files");
            DropPrimaryKey("dbo.Songs");
            AddColumn("dbo.Changes", "User_ID", c => c.Long());
            AddColumn("dbo.Songs", "Number", c => c.Int(nullable: false));
            AlterColumn("dbo.Changes", "ID", c => c.Long(nullable: false, identity: true));
            AlterColumn("dbo.Changes", "Song_ID", c => c.Long());
            AlterColumn("dbo.Users", "ID", c => c.Long(nullable: false, identity: true));
            AlterColumn("dbo.Files", "ID", c => c.Long(nullable: false, identity: true));
            AlterColumn("dbo.Songs", "ID", c => c.Long(nullable: false, identity: true));
            AddPrimaryKey("dbo.Changes", "ID");
            AddPrimaryKey("dbo.Users", "ID");
            AddPrimaryKey("dbo.Files", "ID");
            AddPrimaryKey("dbo.Songs", "ID");
            CreateIndex("dbo.Changes", "User_ID");
            CreateIndex("dbo.Changes", "Song_ID");
            AddForeignKey("dbo.Changes", "User_ID", "dbo.Users", "ID");
            AddForeignKey("dbo.Changes", "Song_ID", "dbo.Songs", "ID");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Changes", "Song_ID", "dbo.Songs");
            DropForeignKey("dbo.Changes", "User_ID", "dbo.Users");
            DropIndex("dbo.Changes", new[] { "Song_ID" });
            DropIndex("dbo.Changes", new[] { "User_ID" });
            DropPrimaryKey("dbo.Songs");
            DropPrimaryKey("dbo.Files");
            DropPrimaryKey("dbo.Users");
            DropPrimaryKey("dbo.Changes");
            AlterColumn("dbo.Songs", "ID", c => c.Int(nullable: false, identity: true));
            AlterColumn("dbo.Files", "ID", c => c.Int(nullable: false, identity: true));
            AlterColumn("dbo.Users", "ID", c => c.Int(nullable: false, identity: true));
            AlterColumn("dbo.Changes", "Song_ID", c => c.Int());
            AlterColumn("dbo.Changes", "ID", c => c.Int(nullable: false, identity: true));
            DropColumn("dbo.Songs", "Number");
            DropColumn("dbo.Changes", "User_ID");
            AddPrimaryKey("dbo.Songs", "ID");
            AddPrimaryKey("dbo.Files", "ID");
            AddPrimaryKey("dbo.Users", "ID");
            AddPrimaryKey("dbo.Changes", "ID");
            CreateIndex("dbo.Changes", "Song_ID");
            CreateIndex("dbo.Changes", "UserId");
            AddForeignKey("dbo.Changes", "Song_ID", "dbo.Songs", "ID");
            AddForeignKey("dbo.Changes", "UserId", "dbo.Users", "ID", cascadeDelete: true);
        }
    }
}
