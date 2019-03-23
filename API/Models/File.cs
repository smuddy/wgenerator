using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models {
    public class File {
        public long ID { get; set; }
        [Index(IsUnique = true)]
        public Guid ReferenceFile { get; set; }
        public string Name { get; set; }
        public FileType FileType { get; set; }

        public virtual Song Song { get; set; }
    }
}