using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Repository.Repositories
{
    public class UserRepository : IRepository<User>
    {
        private readonly IContext context;
        public UserRepository(IContext context)
        {
            this.context = context;
        }

        public async Task<User> AddItem(User item)
        {
            await context.users.AddAsync(item);
            await context.Save();
            return item;       
        }


        public async Task DeleteItem(int id)
        {
            context.users.Remove(await GetById(id));
            await context.Save();
        }

        public async Task<List<User>> GetAll()
        {
            return await context.users.ToListAsync();
        }

        public async Task<User> GetById(int id)
        {
            return await context.users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<User> UpdateItem(int id, User item)
        {
            var user = await GetById(id);
            if (user != null)
            {
                if(item.Email != "string")
                    user.Email = item.Email;
                if (item.Password != "string")
                    user.Password = item.Password;          
                await context.Save();
            }
            return user;
        }       
    }
}
