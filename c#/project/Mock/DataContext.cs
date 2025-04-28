using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Interface;
using Repository.Entities;

namespace Mock
{
    public class DataContext:DbContext,IContext
    {
        public DbSet<Plant> plants {  get; set; }
        public DbSet<PlantCharacterization> plantsCharacterization { get; set;}
        public DbSet<User> users { get; set; }
        public async Task Save()
        {
            await SaveChangesAsync();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("server=LAPTOP-H0EJGA25\\SQLEXPRESS01;database=nurseryDb;trusted_connection=true;TrustServerCertificate=True");
        }
    }
}
