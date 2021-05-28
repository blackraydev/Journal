using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class Subjects {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}