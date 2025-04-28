using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Common.Dto
{
    public class PlantDto
    {
        public int? Id { get; set; }
        public int? PlantCharacterizationId { get; set; }
        [ForeignKey("PlantCharacterizationId")]
        public string? Name { get; set; }
        public byte[]? Image { get; set; }
        public IFormFile? ImageFile { get; set; }
        public double? Price { get; set; }
        public string? Color { get; set; }
    }
}
