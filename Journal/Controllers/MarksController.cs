using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Journal.Models;
using Microsoft.Extensions.Logging;

namespace Journal.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class MarksController : Controller {
        private readonly ILogger<MarksController> _logger;
        public AppDbContext _context;

        public MarksController(ILogger<MarksController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;
        }
        
        [HttpGet("")]
        public IActionResult GetMarks() {
            var marks = _context.Marks.ToList();
            return Ok(marks);
        }
        
        [HttpPost("create")]
        public IActionResult CreateMark(Marks mark) {
            _context.Marks.Add(mark);
            _context.SaveChanges();
            
            return Ok(mark);
        }
        
        [HttpPost("edit")]
        public IActionResult EditMark(Marks editedMark) {
            var targetMark = _context.Marks.FirstOrDefault(mrk => mrk.Id == editedMark.Id);

            _context.Marks.Remove(targetMark);
            _context.Marks.Add(editedMark);
            _context.SaveChanges();

            return Ok(editedMark);
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteMark(int id) {
            var deletedMark = _context.Marks.FirstOrDefault(mrk => mrk.Id == id);
            
            _context.Marks.Remove(deletedMark);
            _context.SaveChanges();

            return Ok(deletedMark);
        }
    }
}