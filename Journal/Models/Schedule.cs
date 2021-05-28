using System;
using System.ComponentModel.DataAnnotations;

namespace Journal.Models {
    public class Schedule {
        [Key]
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int TeacherId { get; set; }
        public int SubjectId { get; set; }
        public string Date { get; set; }
        public string Theme { get; set; }
        public string Homework { get; set; }
    }
}