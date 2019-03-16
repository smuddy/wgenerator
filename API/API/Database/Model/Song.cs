using System.Collections.Generic;

namespace API.Database.Model {
    public class Song {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public string Comments { get; set; }
        public string Key { get; set; }
        public int? Tempo { get; set; }
        public SongType SongType { get; set; }

        public bool Final { get; set; }

        public virtual ICollection<Change> Changes { get; set; }
    }
}