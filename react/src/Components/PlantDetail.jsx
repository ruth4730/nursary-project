import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Droplet, DropletOff, Droplets, Sun, SunDim, SunMedium, Thermometer, ThermometerSun, ThermometerSnowflake, Flower2, Snowflake, Leaf } from "lucide-react";

const PlantDetail = () => {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);
    const [plantCharacterization, setPlantCharacterization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get(`https://localhost:7065/api/Plant/${id}`)
        .then((response) => {
          setPlant(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching plant data:", error);
          setError("Failed to load plant data");
          setLoading(false);
        });
    }, [id]);
  
   
    useEffect(() => {
        if (!plant || !plant.plantCharacterizationId) return; // מונע קריאה לפני שהנתונים זמינים
        const x = axios.get(`https://localhost:7065/api/PlantCharacterization/${plant.plantCharacterizationId}`)  // שים את ה-API המתאים לקבלת כל התמונות
        x.then((response) => {
          console.log(response.data);
          setPlantCharacterization(response.data); // שמירת הנתונים ב-state הנכון
        }).catch((error) => {
          console.error("Error fetching data:", error);
        })
    }, [plant]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const getSeasonIcon = (season) => {
      switch (season) {
        case 0:
          return <Sun className="icon summer-icon" />;
        case 1:
          return <Snowflake className="icon winter-icon" />;
        case 2:
          return <Flower2 className="icon spring-icon" />;
        case 3:
          return <Leaf className="icon autumn-icon" />;
        case 4:
          return <AllSeasonsIcon />;
        default:
          return null;
      }
    };
    const getSeasonColor = (season) => {
      switch (season) {
        case 0:
          return "#ffecb3"; // צהוב בהיר (קיץ)
        case 1:
          return "#e0f2f7"; // כחול בהיר (חורף)
        case 2:
          return "#c8e6c9"; // ירוק בהיר (אביב)
        case 3:
          return "#ffe0b2"; // כתום בהיר (סתיו)
        default:
          return "#ffffff"; // לבן (ברירת מחדל)
      }
    };
    const getTemperatureIcon = (temperature) => {
      switch (temperature) {
        case 0:
        case 1:
          return <ThermometerSnowflake className="icon temperature-icon" />;
        case 2:
        case 3:
          return <Thermometer className="icon temperature-icon" />;
        case 4:
        case 5:
          return <ThermometerSun className="icon temperature-icon" />;
        default:
          return null;
      }
    };
    const getIrrigationIcon = (irrigation) => {
      switch (irrigation) {
        case 0:
          return <Droplets className="icon irrigation-icon" />;
        case 1:
          return <DropletOff className="icon irrigation-icon" />;
        case 2:
          return <Droplet className="icon irrigation-icon" />;
        default:
          return null;
      }
    };
    const getSunIcon = (sun) => {
      switch (sun) {
        case 0:
          return <Sun className="icon sun-icon" />;
        case 1:
          return <SunDim className="icon sun-icon" />;
        case 2:
          return <SunMedium className="icon sun-icon" />;
        default:
          return null;
      }
    }
    const AllSeasonsIcon = () => {
      return (
        <div className="all-seasons-icon">
          <div className="season-quarter top-left">
            <Sun className="icon small-season-icon summer-icon" />
          </div>
          <div className="season-quarter top-right">
            <Snowflake className="icon small-season-icon winter-icon" />
          </div>
          <div className="season-quarter bottom-left">
            <Flower2 className="icon small-season-icon spring-icon" />
          </div>
          <div className="season-quarter bottom-right">
            <Leaf className="icon small-season-icon autumn-icon" />
          </div>
        </div>
      );
    };
    return (
      <div className="plant-detail-container">
    {/* מיכל התמונה בצד ימין */}
    <div className="right-div">
      <img
        src={`data:image/jpg;base64,${plant.image}`}
        className="plant-detail-img"
        alt={plant.name}
      />
    </div>

    {/* מיכל הפרטים בצד שמאל */}
    <div className="left-container">
      <h1 className="plant-detail-name">{plant.name}</h1>
      
      <div className="left-rectangles">
        {Array.from({ length: 5 }, (_, index) => (
          <div className="rectangle" key={index}>
            <div className="rectangle-content">
              {/* תוכן המלבן */}
            </div>
          </div>
        ))}
      </div>

      {/* אייקונים */}
        <div className="sun">
        </div>
        {getSunIcon(plantCharacterization?.sun - 1)}
        <div className="irrigation">
        </div>
        {getIrrigationIcon(plantCharacterization?.irrigation - 1)}
        {getTemperatureIcon(plantCharacterization?.temperature - 1)}
        {getSeasonIcon(plantCharacterization?.season - 1)}

        <div className="icon-container temperature">
        </div>
        <div
          className="icon-container season"
          style={{ backgroundColor: getSeasonColor(plantCharacterization?.season - 1) }}
        >
        </div>
      </div>
  </div>
    );
  };
export default PlantDetail;

