using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models {
    public class User {
        public long ID { get; set; }
        [Index(IsUnique = true)]
        public string Account { get; set; }
        public string Pass { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        [Index(IsUnique = true)]
        public string Email { get; set; }
        public Access Access { get; set; }
    }
}