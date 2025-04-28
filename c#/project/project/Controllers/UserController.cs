using Common.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using project.Models;
using Repository.Entities;
using Service.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService<UserDto> service;
        public UserController(IUserService<UserDto> service)
        {
            this.service = service;
        }
        // GET: api/<UserController>
        [HttpGet]
        public Task<List<UserDto>> Get()
        {
            return service.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public Task<UserDto> Get(int id)
        {
            return service.GetById(id);
        }

        // POST api/<UserController>
        [HttpPost("SignIn")]
        public async Task<IActionResult> Post([FromBody] UserLogin userLogin)
        {
            var user = await service.GetByEmailAndPassword(userLogin.Email, userLogin.Password);
            if (user != null)
            {
                var token = service.Generate(user);
                return Ok(token);
            }
            return BadRequest("user not found");
        }
        [HttpPost("SignUp")]
        public async Task<IActionResult> Post([FromBody] UserDto user)
        {
            user = await service.AddItem(user);
            var token = service.Generate(user);
            return Ok(new { Token = token, Email = user.Email, Password = user.Password });
        }
        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] UserDto value)
        {
            var user = await service.UpdateItem(id,value);   
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await service.DeleteItem(id);
        }
        
    }
}
