using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Service.Models
{
    internal class PlantAnalysisResult
    {
        [JsonPropertyName("watering_scores")]
        public List<int> WateringScores { get; set; }

        [JsonPropertyName("sunlight_scores")]
        public List<int> SunlightScores { get; set; }

        [JsonPropertyName("size_scores")]
        public List<int> SizeScores { get; set; }

        [JsonPropertyName("season_scores")]
        public List<int> SeasonScores { get; set; }

        [JsonPropertyName("temperature_class")]
        public int TemperatureClass { get; set; }

        [JsonPropertyName("color")]
        public string Color { get; set; }
    }
}
