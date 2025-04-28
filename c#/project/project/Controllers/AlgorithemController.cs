using Common.Dto;
using Service.Interface;
using Microsoft.AspNetCore.Mvc;
using Service.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlgorithemController : ControllerBase
    {
        private readonly IAlgorithem algorithem;
        public AlgorithemController(IAlgorithem algorithem)
        {
            this.algorithem = algorithem;
        }

        // POST api/<AlgorithemController>
        [HttpPost]
        public async Task<List<PlantDto>> Post([FromBody] string text)
        {
            return await algorithem.MatchPlantForYou(text);
        }
    }
}
