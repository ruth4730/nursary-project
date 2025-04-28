using Common.Dto;
using Repository.Entities;
using Repository.Interface;
using Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.Interface;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace Service.Services
{
    public class UserService : IUserService<UserDto>
    {
        private readonly IRepository<User> repository;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;
        public UserService(IRepository<User> repository, IMapper mapper, IConfiguration configuration)
        {
            this.repository = repository;
            this.mapper = mapper;
            this.configuration = configuration;
        }     
        public async Task<UserDto> AddItem(UserDto item)
        {
            return mapper.Map<UserDto>(await repository.AddItem(mapper.Map<User>(item)));
        }
        public async Task DeleteItem(int id)
        {
            await repository.DeleteItem(id);
        }

        public async Task<List<UserDto>> GetAll()
        {
            return mapper.Map<List<UserDto>>(await repository.GetAll());
        }
        public async Task<UserDto> GetById(int id)
        {
            return mapper.Map<UserDto>(await repository.GetById(id));
        }
        public async Task<UserDto> UpdateItem(int id, UserDto item)
        {
            return mapper.Map<UserDto>(await repository.UpdateItem(id, mapper.Map<User>(item)));
        }
        public string Generate(UserDto user)
        {
            var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securitykey, SecurityAlgorithms.HmacSha256);
            var claims = new[] {
            new Claim(ClaimTypes.Email,user.Email),
            };
            var token = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<UserDto> GetByEmailAndPassword(string email, string password)
        {
            var users = await repository.GetAll();
            User? source = users.FirstOrDefault(u => u.Email == email && u.Password == password);
            return mapper.Map<UserDto>(source);
        }
    }
}
