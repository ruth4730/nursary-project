using Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Dto;
using AutoMapper;
using Repository.Entities;
using Repository.Interface;
using Repository.Repositories;

namespace Service.Services
{
    public class PlantService : IService<PlantDto>
    {
        private readonly IRepository<Plant> repository;
        private readonly IMapper mapper;
        public PlantService(IRepository<Plant> repository,IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<PlantDto> AddItem(PlantDto item)
        {
            var plant = mapper.Map<Plant>(item);
            plant = await repository.AddItem(plant); // שומר במסד הנתונים ומקבל ID

            if (item.ImageFile != null)
            {
                // קובע את שם התמונה להיות ה-ID של הצמח עם סיומת מתאימה
                var fileExtension = Path.GetExtension(item.ImageFile.FileName); // מוצא את הסיומת (למשל .jpg)
                var fileName = $"{plant.Id}{fileExtension}"; // שם התמונה יהיה ID הצמח
                var path = Path.Combine(Environment.CurrentDirectory, "images", fileName);

                // שומר את התמונה בתיקייה
                using (FileStream fs = new FileStream(path, FileMode.Create))
                {
                    await item.ImageFile.CopyToAsync(fs);
                }

                // שומר את שם התמונה במסד הנתונים
                plant.ImageUrl = fileName;
                await repository.UpdateItem(plant.Id,plant);
            }

            return mapper.Map<PlantDto>(plant);
        }

        public async Task DeleteItem(int id)
        {
            // מחפש קובץ תמונה בתיקיית התמונות עם שם התואם ל-ID
            var imageDirectory = Path.Combine(Environment.CurrentDirectory, "images");
            string imagePath = "";
            var potentialPath = Path.Combine(imageDirectory, $"{id}.jpg");
            if (File.Exists(potentialPath))
            {
                imagePath = potentialPath;
            }

            // אם נמצא קובץ מתאים, מוחק אותו
            if (imagePath != "")
            {
                File.Delete(imagePath);
            }

            await repository.DeleteItem(id);
        }

        public async Task<List<PlantDto>> GetAll()
        {
            return mapper.Map<List<PlantDto>>(await repository.GetAll());
        }

        public async Task<PlantDto> GetById(int id)
        {
            return mapper.Map<PlantDto>(await repository.GetById(id));
        }

        public async Task<PlantDto> UpdateItem(int id, PlantDto item)
        {
            var plant = mapper.Map<Plant>(item);
            if(plant.ImageUrl!=null)
            //if(item.ImageFile != null)
            {
                var imageDirectory = Path.Combine(Environment.CurrentDirectory, "images");
                var imagePath = Path.Combine(imageDirectory, $"{id}.jpg");
                if (File.Exists(imagePath))
                {
                    File.Delete(imagePath);
                }
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await (item.ImageFile).CopyToAsync(stream);
                }
            }
            return mapper.Map<PlantDto>(await repository.UpdateItem(id, mapper.Map<Plant>(item)));
        }
    }
}
