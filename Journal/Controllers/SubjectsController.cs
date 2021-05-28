using System.Linq;
using Journal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Journal.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class SubjectsController : Controller {
        private readonly ILogger<SubjectsController> _logger;
        public AppDbContext _context;

        public SubjectsController(ILogger<SubjectsController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;
        }
        
        [HttpGet("")]
        public IActionResult GetSubjects() {
            var subjects = _context.Subjects.ToList();
            return Ok(subjects);
        }
        
        [HttpPost("create")]
        public IActionResult CreateSubject(Subjects subject) {
            _context.Subjects.Add(subject);
            _context.SaveChanges();
            
            return Ok(subject);
        }
        
        [HttpPost("edit")]
        public IActionResult EditSubject(Subjects editedSubject) {
            var targetSubject = _context.Subjects.FirstOrDefault(subject => subject.Id == editedSubject.Id);

            _context.Subjects.Remove(targetSubject);
            _context.Subjects.Add(editedSubject);
            _context.SaveChanges();

            return Ok(editedSubject);
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteSubject(int id) {
            var deletedSubject = _context.Subjects.FirstOrDefault(subject => subject.Id == id);
            
            _context.Subjects.Remove(deletedSubject);
            _context.SaveChanges();

            return Ok(deletedSubject);
        }
    }
}