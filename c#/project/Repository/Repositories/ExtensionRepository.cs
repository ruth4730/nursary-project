using Microsoft.Extensions.DependencyInjection;
using Repository.Entities;
using Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public static class ExtensionRepository
    {
        public static IServiceCollection AddRepository(this IServiceCollection service)
        {
            service.AddScoped<IRepository<Plant>,PlantRepository>();
            service.AddScoped<IRepository<PlantCharacterization>, PlantCharacterizationRepository>();
            service.AddScoped<IRepository<User>, UserRepository>();
            return service;
        }
    }
}
