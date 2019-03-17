using System;

namespace API.Models {
    public class Change {
        public long ID { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime Date { get; set; }
        public string Comment { get; set; }
    }
}