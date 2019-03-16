namespace API.Database.Model {
    public class User {
        public int ID { get; set; }
        public string Account { get; set; }
        public string Pass { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public Access Access { get; set; }
    }
}