using Common.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Service.Interface
{
    public interface IAlgorithem
    {
        Task<List<PlantDto>> MatchPlantForYou(string text);
    }
}
