using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class Marks {
        [Key]
        public int Id { get; set; }
        public int LessonId { get; set; }
        public int SubjectId { get; set; }
        public int StudentId { get; set; }
        public string Mark { get; set; }
    }
}