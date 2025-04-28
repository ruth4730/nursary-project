using Repository.Interface;
using Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Dto;
using Repository.Interface;
using Repository.Entities;
using Service.Interface;
using AutoMapper;

namespace Service.Services
{
    public class plantsCharacterizationService : IService<PlantCharacterizationDto>
    {
        private readonly IRepository<PlantCharacterization> repository;
        private readonly IMapper mapper;

        public plantsCharacterizationService(IRepository<PlantCharacterization> repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<PlantCharacterizationDto> AddItem(PlantCharacterizationDto item)
        {
            return mapper.Map<PlantCharacterizationDto>(await repository.AddItem(mapper.Map<PlantCharacterization>(item)));
        }

        public async Task DeleteItem(int id)
        {
            await repository.DeleteItem(id);    
        }

        public async Task<List<PlantCharacterizationDto>> GetAll()
        {
            return mapper.Map<List<PlantCharacterizationDto>>(await repository.GetAll());
        }

        public async Task<PlantCharacterizationDto> GetById(int id)
        {
            return mapper.Map<PlantCharacterizationDto>(await repository.GetById(id));
        }

        public async Task<PlantCharacterizationDto> UpdateItem(int id, PlantCharacterizationDto item)
        {
            return mapper.Map<PlantCharacterizationDto>(await repository.UpdateItem(id, mapper.Map<PlantCharacterization>(item)));
        }
    }
}
