using System.Linq;
using Journal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Journal.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class HomeworksController : Controller {
        private readonly ILogger<HomeworksController> _logger;
        public AppDbContext _context;
        
        public HomeworksController(ILogger<HomeworksController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;
        }
        
        [HttpGet("")]
        public IActionResult GetHomeworks() {
            var homeworks = _context.Homeworks.ToList();
            return Ok(homeworks);
        }
        
        [HttpPost("create")]
        public IActionResult CreateHomework(Homeworks homework) {
            _context.Homeworks.Add(homework);
            _context.SaveChanges();
            
            return Ok(homework);
        }
        
        [HttpPost("save")]
        public IActionResult SaveHomework(Homeworks homework) {
            var targetHomework = _context.Homeworks.FirstOrDefault(hmwrk => hmwrk.Id == homework.Id);

            _context.Homeworks.Remove(targetHomework);
            _context.Homeworks.Add(homework);
            _context.SaveChanges();

            return Ok(homework);
        }
    }
}