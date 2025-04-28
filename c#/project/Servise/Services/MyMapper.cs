using AutoMapper;
using Common.Dto;
using Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services
{
    public class MyMapper:Profile
    {
        string DirectoryUrl = Environment.CurrentDirectory + "\\Images\\";
        public MyMapper()
        {
            CreateMap<Plant, PlantDto>().ForMember("Image", s => s.MapFrom(y => convertToByte(DirectoryUrl + $"{y.Id}.jpg")));
            CreateMap<PlantDto, Plant>().ForMember("ImageUrl", s => s.MapFrom(y => y.ImageFile.FileName.ToString()));
            CreateMap<PlantCharacterizationDto, PlantCharacterization>();
            CreateMap<UserDto, User>();
            CreateMap<PlantCharacterization, PlantCharacterizationDto>();
            CreateMap<User, UserDto>();
        }

        byte[] convertToByte(string s)
        {
            byte[] bytes = File.ReadAllBytes(s);
            return bytes;
        }

    }
}
