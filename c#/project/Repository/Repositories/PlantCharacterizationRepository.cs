using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using Repository.Interface;

namespace Repository.Repositories
{
    public class PlantCharacterizationRepository : IRepository<PlantCharacterization>
    {
        private readonly IContext context;
        public PlantCharacterizationRepository(IContext context)
        {
            this.context = context;
        }
        public async Task<PlantCharacterization> AddItem(PlantCharacterization item)
        {
            await context.plantsCharacterization.AddAsync(item);
            await context.Save();
            return item;
        }

        public async Task DeleteItem(int id)
        {
            context.plantsCharacterization.Remove(await GetById(id));
            await context.Save();
        }

        public async Task<List<PlantCharacterization>> GetAll()
        {
            return await context.plantsCharacterization.ToListAsync();
        }

        public async Task<PlantCharacterization> GetById(int id)
        {
            return await context.plantsCharacterization.FirstOrDefaultAsync(x=>x.Id==id);
        }

        public async Task<PlantCharacterization> UpdateItem(int id, PlantCharacterization item)
        {
            var plantC = await GetById(id);
            if (plantC != null)
            {
                // בדיקה אם הערך מועבר בבקשה 
                // באמצעות השוואה לערך ברירת המחדל של ה-enum

                // בהנחה שכל אחד מהם הוא enum, נבדוק אם הערך שנשלח אינו 0 (ברירת המחדל)
                if ((int)item.Sun != 0)
                    plantC.Sun = item.Sun;

                if ((int)item.MaxSize != 0)
                    plantC.MaxSize = item.MaxSize;

                if ((int)item.Season != 0)
                    plantC.Season = item.Season;

                if ((int)item.temperature != 0)
                    plantC.temperature = item.temperature;

                if ((int)item.Irrigation != 0)
                    plantC.Irrigation = item.Irrigation;

                await context.Save();
            }
            return plantC;
        }
    }
}
