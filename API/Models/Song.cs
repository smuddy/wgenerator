using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models {
    public class Song {
        public long ID { get; set; }
        [Index(IsUnique = true)]
        public int Number { get; set; }
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