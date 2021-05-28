using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Journal.Models;
using Microsoft.Extensions.Logging;

namespace Journal.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class GroupsController : Controller {
        private readonly ILogger<GroupsController> _logger;
        public AppDbContext _context;

        public GroupsController(ILogger<GroupsController> logger, AppDbContext context) {
            _logger = logger;
            _context = context;
        }
        
        [HttpGet("")]
        public IActionResult GetGroups() {
            var groups = _context.Groups.ToList();
            return Ok(groups);
        }
        
        [HttpPost("create")]
        public IActionResult CreateGroup(Groups group) {
            _context.Groups.Add(group);
            _context.SaveChanges();
            
            return Ok(group);
        }
        
        [HttpPost("edit")]
        public IActionResult EditGroup(Groups editedGroup) {
            var targetGroup = _context.Groups.FirstOrDefault(grp => grp.Id == editedGroup.Id);

            _context.Groups.Remove(targetGroup);
            _context.Groups.Add(editedGroup);
            _context.SaveChanges();

            return Ok(editedGroup);
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteGroup(int id) {
            var deletedGroup = _context.Groups.FirstOrDefault(grp => grp.Id == id);
            
            _context.Groups.Remove(deletedGroup);
            _context.SaveChanges();

            return Ok(deletedGroup);
        }
    }
}