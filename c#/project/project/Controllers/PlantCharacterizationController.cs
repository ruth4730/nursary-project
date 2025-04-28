using Common.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Entities;
using Service.Interface;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantCharacterizationController : ControllerBase
    {
        private readonly IService<PlantCharacterizationDto> service;
        public PlantCharacterizationController(IService<PlantCharacterizationDto> service)
        {
            this.service = service;
        }
        // GET: api/<PlantCharacterizationController>
        [HttpGet]
        public Task<List<PlantCharacterizationDto>> Get()
        {
            return service.GetAll();
        }

        // GET api/<PlantCharacterizationController>/5
        [HttpGet("{id}")]
        public Task<PlantCharacterizationDto> Get(int id)
        {
            return service.GetById(id);
        }

        // POST api/<PlantCharacterizationController>
        [HttpPost]
        public async Task<PlantCharacterizationDto> Post([FromForm] PlantCharacterizationDto value)
        {
            return await service.AddItem(value);
        }

        // PUT api/<PlantCharacterizationController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromForm] PlantCharacterizationDto value)
        {
            await service.UpdateItem(id, value);
        }

        // DELETE api/<PlantCharacterizationController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await service.DeleteItem(id);
        }
    }
}
