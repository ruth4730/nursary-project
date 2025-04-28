using Common.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interface;
using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantController : ControllerBase
    {
        private readonly IService<PlantDto> service;
        public PlantController(IService<PlantDto> service)
        {
            this.service = service;
        }
        // GET: api/<PlantController>
        [HttpGet]
        public async Task<List<PlantDto>> Get()
        {
            return await service.GetAll();
        }

        // GET api/<PlantController>/5
        [HttpGet("{id}")]
        public Task<PlantDto> Get(int id)
        {
            return service.GetById(id);
        }

        // POST api/<PlantController>
        [HttpPost]
        public async Task<PlantDto> Post([FromForm] PlantDto value)
        {
            return await service.AddItem(value);
        }

        // PUT api/<PlantController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromForm] PlantDto value)
        {
            await service.UpdateItem(id, value);
        }

        // DELETE api/<PlantController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await service.DeleteItem(id);
        }
    }
}
