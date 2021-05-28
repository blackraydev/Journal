using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class Users {
        [Key]
        public int Id { get; set; }
        public string Role { get; set; }
        public string FullName { get; set; }
        public string BirthDate { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
    }
}