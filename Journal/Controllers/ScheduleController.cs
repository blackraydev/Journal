using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Journal.Models;
using Microsoft.Extensions.Logging;

namespace Journal.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : Controller {
        private readonly ILogger<ScheduleController> _logger;
        public AppDbContext _context;

        public ScheduleController(ILogger<ScheduleController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;
        }
        
        [HttpGet("")]
        public IActionResult GetSchedule() {
            var schedule = _context.Schedule.ToList();
            return Ok(schedule);
        }
        
        [HttpPost("create")]
        public IActionResult CreateSchedule(Schedule schedule) {
            _context.Schedule.Add(schedule);
            _context.SaveChanges();
            
            return Ok(schedule);
        }
        
        [HttpPost("edit")]
        public IActionResult EditSchedule(Schedule editedSchedule) {
            var targetSchedule = _context.Schedule.FirstOrDefault(grp => grp.Id == editedSchedule.Id);

            _context.Schedule.Remove(targetSchedule);
            _context.Schedule.Add(editedSchedule);
            _context.SaveChanges();

            return Ok(editedSchedule);
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteSchedule(int id) {
            var deletedSchedule = _context.Schedule.FirstOrDefault(schdl => schdl.Id == id);
            
            _context.Schedule.Remove(deletedSchedule);
            _context.SaveChanges();

            return Ok(deletedSchedule);
        }
    }
}