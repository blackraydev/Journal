using System;
using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class Homeworks {
        [Key]
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int LessonId { get; set; }
        public DateTime Date { get; set; }
        public string Solution { get; set; }
        public string Note { get; set; }
    }
}