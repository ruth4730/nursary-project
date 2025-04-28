using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repository.Entities;

namespace Common.Dto
{
    public class PlantCharacterizationDto
    {
        public int? Id { get; set; }
        public sunshainLevel? Sun { get; set; }
        public irrigation? Irrigation { get; set; }
        public maxSize? MaxSize { get; set; }
        public season? Season { get; set; }
        public temperature? temperature { get; set; }
    }
}
