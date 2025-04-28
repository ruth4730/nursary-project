using Common.Dto;
using Microsoft.Extensions.DependencyInjection;
using Repository.Entities;
using Repository.Interface;
using Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.Interface;

namespace Service.Services
{
    public static class ExtensionService
    {
        public static IServiceCollection AddService(this IServiceCollection service)
        {
            service.AddRepository();
            service.AddScoped<IService<PlantDto>, PlantService>();
            service.AddScoped<IService<PlantCharacterizationDto>, plantsCharacterizationService>();
            service.AddScoped<IUserService<UserDto>, UserService>();
            service.AddScoped<IAlgorithem, Algorithem>();
            service.AddAutoMapper(typeof(MyMapper));
            return service;
        }
    }
}
