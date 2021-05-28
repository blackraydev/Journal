using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class Students {
        [Key]
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int GroupId { get; set; }
    }
}