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
    public class PlantRepository : IRepository<Plant>
    {
        private readonly IContext context;
        public PlantRepository(IContext context)
        {
            this.context = context;
        }
        public async Task<Plant> AddItem(Plant item)
        {
            await context.plants.AddAsync(item);
            await context.Save();
            return item;
        }

        public async Task DeleteItem(int id)
        {
            context.plants.Remove(await GetById(id));
            await context.Save();
        }

        public async Task<List<Plant>> GetAll()
        {
            return await context.plants.ToListAsync();
        }

        public async Task<Plant> GetById(int id)
        {
            return await context.plants.FirstOrDefaultAsync(x=>x.Id==id);
        }

        public async Task<Plant> UpdateItem(int id, Plant item)
        {
            var plant=await GetById(id);
            if (plant!=null)
            {
                if (!string.IsNullOrEmpty(item.Name))
                    plant.Name = item.Name;
                if (item.Price != 0) 
                    plant.Price = item.Price;
                if (!string.IsNullOrEmpty(item.Color))
                    plant.Color = item.Color;
                await context.Save();
            }            
            return plant;
        }
    }
}
