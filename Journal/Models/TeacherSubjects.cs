using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class TeacherSubjects {
        [Key]
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public int TeacherId { get; set; }
    }
}