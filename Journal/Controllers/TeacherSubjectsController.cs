using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Journal.Models;
using Microsoft.Extensions.Logging;

namespace Journal.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherSubjectsController : Controller {
        private readonly ILogger<TeacherSubjectsController> _logger;
        public AppDbContext _context;

        public TeacherSubjectsController(ILogger<TeacherSubjectsController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;
        }

        [HttpGet("")]
        public IActionResult GetTeacherSubjects() {
            var teacherSubjects = _context.TeacherSubjects.ToList();
            return Ok(teacherSubjects);
        }
    }
}