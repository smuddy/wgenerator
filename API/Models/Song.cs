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

        public virtual ICollection<File> Files { get; set; }
    }

    public class KeysSMaj {
        public const string C = "C";
        public const string CS = "C#";
        public const string D = "D";
        public const string DS = "D#";
        public const string E = "E";
        public const string F = "F";
        public const string FS = "F#";
        public const string G = "G";
        public const string GS = "G#";
        public const string A = "A";
        public const string AS = "A#";
        public const string H = "H";
    }

    public class KeysSMin {
        public const string C = "c";
        public const string CS = "c#";
        public const string D = "d";
        public const string DS = "d#";
        public const string E = "e";
        public const string F = "f";
        public const string FS = "f#";
        public const string G = "g";
        public const string GS = "g#";
        public const string A = "a";
        public const string AS = "a#";
        public const string H = "h";
    }

    public class KeysBMaj {
        public const string C = "C";
        public const string DB = "Db";
        public const string D = "D";
        public const string EB = "Eb";
        public const string E = "E";
        public const string F = "F";
        public const string GB = "Gb";
        public const string G = "G";
        public const string AB = "Ab";
        public const string A = "A";
        public const string HB = "B";
        public const string H = "H";
    }
    
    public class KeysBMin {
        public const string C = "a";
        public const string DB = "db";
        public const string D = "d";
        public const string EB = "eb";
        public const string E = "e";
        public const string F = "f";
        public const string GB = "gb";
        public const string G = "g";
        public const string AB = "ab";
        public const string A = "a";
        public const string HB = "b";
        public const string H = "h";
    }


}