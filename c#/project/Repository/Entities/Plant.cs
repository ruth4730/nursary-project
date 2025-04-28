using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entities
{
    public class Plant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public double Price { get; set; }
        public string Color { get; set; }
        public int PlantCharacterizationId { get; set; }
        [ForeignKey("PlantCharacterizationId")]
        public virtual PlantCharacterization PlantCharacterization { get; set; }
    }
}
