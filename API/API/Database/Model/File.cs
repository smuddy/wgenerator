using System;

namespace API.Database.Model {
    public class File {
        public int ID { get; set; }
        public Guid ReferenceFile { get; set; }
        public string Name { get; set; }
        public FileType FileType { get; set; }
    }
}