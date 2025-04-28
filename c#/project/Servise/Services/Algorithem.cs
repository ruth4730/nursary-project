using Repository.Entities;
using Repository.Interface;
using Service.Interface;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Common.Dto;
using System.Threading.Tasks;
using System.Text.Json;
using Repository.Repositories;
using AutoMapper;
using Service.Models;

namespace Service.Services
{
    public class Algorithem : IAlgorithem
    {
        private readonly IRepository<PlantCharacterization> pcRepository;
        private readonly IRepository<Plant> pRepository;
        private readonly IMapper mapper;
        private readonly HttpClient httpClient;
        private readonly string baseUrl = "http://127.0.0.1:8000";

        public Algorithem(IRepository<PlantCharacterization> pcRepository, IRepository<Plant> pRepository, IMapper mapper)
        {
            this.pcRepository = pcRepository;
            this.pRepository = pRepository;
            this.mapper = mapper;
            this.httpClient = new HttpClient();
        }
        public Color[] MatchColors(string colorName)
        {
            Color baseColor = ConvertNameToColor(colorName);
            (double h, double s, double l) = RGBToHSL(baseColor.R, baseColor.G, baseColor.B);

            // הכנת מערך לארבעת הצבעים
            Color[] tetradColors = new Color[4];

            // צבע ראשון - צבע הבסיס
            tetradColors[0] = baseColor;

            // חישוב שלושת הצבעים הנוספים (במרחקים של 90, 180, 270 מעלות)
            for (int i = 1; i <= 3; i++)
            {
                // חישוב הגוון החדש (הוספת 90 מעלות * i ולקחת מודולו 360)
                double newHue = (h + (90 * i)) % 360;

                // המרה בחזרה ל-RGB ושמירה במערך
                (int r, int g, int b) = HSLToRGB(newHue, s, l);
                tetradColors[i] = Color.FromArgb(r, g, b);
            }
            return tetradColors;
        }
        private Color ConvertNameToColor(string color)
        {
            Color baseColor;
            try
            {
                // ניסיון לפענח שם צבע ידוע
                baseColor = Color.FromName(color);

                // אם לא הצלחנו לפענח (צבע שחור מוחזר כברירת מחדל כשהשם לא ידוע)
                if (baseColor.A == 0 && baseColor.R == 0 && baseColor.G == 0 && baseColor.B == 0 && !color.Equals("Black", StringComparison.OrdinalIgnoreCase))
                {
                    // ניסיון לפענח קוד הקסדצימלי
                    baseColor = ColorTranslator.FromHtml(color);
                }
            }
            catch
            {
                // אם לא הצלחנו לפענח כלל, מחזירים שחור
                baseColor = Color.Black;
            }
            return baseColor;
        }
        private static (double H, double S, double L) RGBToHSL(int r, int g, int b)
        {
            double r1 = r / 255.0;
            double g1 = g / 255.0;
            double b1 = b / 255.0;

            double max = Math.Max(r1, Math.Max(g1, b1));
            double min = Math.Min(r1, Math.Min(g1, b1));
            double h = 0, s = 0, l = (max + min) / 2;

            if (max != min)
            {
                double d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                if (max == r1)
                    h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
                else if (max == g1)
                    h = (b1 - r1) / d + 2;
                else if (max == b1)
                    h = (r1 - g1) / d + 4;

                h /= 6;
            }

            return (h * 360, s * 100, l * 100);
        }

        private static (int R, int G, int B) HSLToRGB(double h, double s, double l)
        {
            // התאמת ערכי הקלט לטווח הנכון
            h = h / 360.0;
            s = s / 100.0;
            l = l / 100.0;

            double r, g, b;

            if (s == 0)
            {
                r = g = b = l; // גוון אפור
            }
            else
            {
                double q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                double p = 2 * l - q;
                r = HueToRGB(p, q, h + 1.0 / 3);
                g = HueToRGB(p, q, h);
                b = HueToRGB(p, q, h - 1.0 / 3);
            }

            return ((int)(r * 255), (int)(g * 255), (int)(b * 255));
        }

        private static double HueToRGB(double p, double q, double t)
        {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1.0 / 6) return p + (q - p) * 6 * t;
            if (t < 1.0 / 2) return q;
            if (t < 2.0 / 3) return p + (q - p) * (2.0 / 3 - t) * 6;
            return p;
        }

        private static readonly HttpClient client = new HttpClient();
        private const string ApiKey = "AIzaSyBPyGoHWDxO7zLtp14Y35vHK1uwvoXsIbU";
        private const string ApiUrl = "https://translation.googleapis.com/language/translate/v2";
        private async Task<string> TranslateHebrewToEnglish(string text)
        {
            var requestBody = new
            {
                q = text,
                source = "iw",
                target = "en",
                format = "text"
            };

            string jsonBody = System.Text.Json.JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync($"{ApiUrl}?key={ApiKey}", content);
            string responseString = await response.Content.ReadAsStringAsync();

            var jsonResponse = JObject.Parse(responseString);
            return jsonResponse["data"]["translations"][0]["translatedText"].ToString();
        }
        private async Task<PlantAnalysisResult> AnalyzeText(string text)
        {
            string url = $"{baseUrl}/analyze_plant_needs";
            var requestData = new { text = text };
            string json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await httpClient.PostAsync(url, content);
            string responseString = await response.Content.ReadAsStringAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<PlantAnalysisResult>(responseString, options);
        }

        public async Task<List<PlantDto>> MatchPlantForYou(string text)
        {
            text=await TranslateHebrewToEnglish (text);
            PlantAnalysisResult analysisResult;
            analysisResult = await AnalyzeText(text);
            Color[] colorArr = new Color[4];
            if (analysisResult.Color != "")
            {
                colorArr = MatchColors(analysisResult.Color);
            }
            var lst = await pRepository.GetAll();
            Dictionary<Plant, int> scorePlant = new Dictionary<Plant, int>();
            foreach (var item in lst)
            {
                int score;
                PlantCharacterization pc;
                if (analysisResult.Color != "")
                {
                    Color c = ConvertNameToColor(item.Color);
                    if (c == colorArr[0])
                    {
                        pc = await pcRepository.GetById(item.PlantCharacterizationId);
                        score = analysisResult.WateringScores[(int)pc.Irrigation] + analysisResult.SunlightScores[(int)pc.Sun] + analysisResult.SizeScores[(int)pc.MaxSize] + analysisResult.SeasonScores[(int)pc.Season] + analysisResult.TemperatureClass;
                        scorePlant.Add(item, score);
                    }
                }
                else
                {
                    pc = await pcRepository.GetById(item.PlantCharacterizationId);
                    score = analysisResult.WateringScores[(int)pc.Irrigation] + analysisResult.SunlightScores[(int)pc.Sun] + analysisResult.SizeScores[(int)pc.MaxSize] + analysisResult.SeasonScores[(int)pc.Season] + analysisResult.TemperatureClass;
                    scorePlant.Add(item, score);
                }

            }
            List<Plant> sortedScorePlant = scorePlant.OrderByDescending(x => x.Value).Select(x => x.Key).ToList();
            return mapper.Map<List<PlantDto>>(sortedScorePlant);
        }
        private async Task<int[]> SendPostRequest(string url, string text)
        {
            var requestData = new { text = text };
            string json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync(url, content);
            string responseString = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Dictionary<string, int[]>>(responseString)["result"];
        }
        private async Task<string> SendStringPostRequest(string url, string text)
        {
            var requestData = new { text = text };
            string json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync(url, content);
            string responseString = await response.Content.ReadAsStringAsync();
            return responseString;
        }
    }

}
