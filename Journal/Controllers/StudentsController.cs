using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Journal.Models;
using Microsoft.Extensions.Logging;

namespace Journal.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : Controller {
        private readonly ILogger<StudentsController> _logger;
        public AppDbContext _context;

        public StudentsController(ILogger<StudentsController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;
        }

        [HttpGet("all")]
        public IActionResult GetAllStudents() {
            var students = _context.Students.ToList();
            return Ok(students);
        }
        
        [HttpGet("{groupId}")]
        public IActionResult GetStudents(int groupId) {
            var users = _context.Users.ToList();
            var students = _context.Students.ToList();
            List<int> currentStudentsId = new List<int>();

            foreach (var student in students) {
                if (student.GroupId == groupId) {
                    currentStudentsId.Add(student.StudentId);
                }
            }
            
            return Ok(currentStudentsId);
        }
        
        [HttpGet("available")]
        public IActionResult GetAvailableStudents() {
            var users = _context.Users.ToList();
            var students = _context.Students.ToList();
            List<int> currentStudentsId = new List<int>();
            List<Users> availableStudents = new List<Users>();

            foreach (var student in students) {
                currentStudentsId.Add(student.StudentId);
            }

            foreach (var user in users) {
                if (!currentStudentsId.Contains(user.Id) && user.Role == "Студент") {
                    availableStudents.Add(user);
                }
            }
            
            return Ok(availableStudents);
        }
        
        [HttpPost("create")]
        public IActionResult CreateStudent(Students student) {
            _context.Students.Add(student);
            _context.SaveChanges();
            
            return Ok(student);
        }
        
        [HttpPost("delete")]
        public IActionResult DeleteStudent(Students student) {
            var deletedStudent = _context.Students.FirstOrDefault(stdnt => 
                stdnt.StudentId == student.StudentId && stdnt.GroupId == student.GroupId
            );
            
            _context.Students.Remove(deletedStudent);
            _context.SaveChanges();

            return Ok(deletedStudent);
        }
    }
}