using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Interface
{
    public interface IUserService<UserDto>: IService<UserDto>
    {
        Task<UserDto> GetByEmailAndPassword(string email, string password);
        string Generate(UserDto user);

    }
}
