using Microsoft.EntityFrameworkCore;
using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interface
{
    public interface IContext
    {
        public DbSet <Plant> plants { get; set; }
        public DbSet <PlantCharacterization> plantsCharacterization { get; set;}
        public DbSet<User> users { get; set; }
        public Task Save();

    }
}
