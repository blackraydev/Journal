using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class Groups {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}