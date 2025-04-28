import { Sun, Snowflake, Flower2, Leaf, Droplet, DropletOff, Droplets, Thermometer, ThermometerSun, ThermometerSnowflake, SunDim, SunMedium } from "lucide-react";
import React from "react";
import "./Styles.css";
//מחזירה את הסטיילים של האייקונים
//מחזירה את אייקון העונה המתאים למספר המייצג שקיבלה 
export function getSeasonIcon(season) {
  switch (season) {
    case 0: return <Sun className="icon summer-icon" />;
    case 1: return <Snowflake className="icon winter-icon" />;
    case 2: return <Flower2 className="icon spring-icon" />;
    case 3: return <Leaf className="icon autumn-icon" />;
    case 4: return <AllSeasonsIcon />;
    default: return null;
  }
}
//מחזירת את תיאור העונה המתאים למספר המייצג שקיבלה
export function getSeasonDesc(season){
          switch (season) {
              case 0:
                return "פורח בקיץ";
              case 1:
                return "פורח בחורף";
              case 2:
                return "פורח באביב";
              case 3:
                return "פורח בסתיו";
              case 4:
                return "פורח בכל העונות";
              default:
                return null;
            }
};
//מחזירה את אייקון השמש המתאים למספר המייצג שקיבלה 
export function getSunIcon(sun) {
  switch (sun) {
    case 0: return <Sun className="icon sun-icon" />;
    case 1: return <SunDim className="icon sun-icon" />;
    case 2: return <SunMedium className="icon sun-icon" />;
    default: return null;
  }
}        
//מחזירה את תיאור השמש המתאים למספר המייצג שקיבלה
export function getSunDesc(sun){
          switch (sun) {
              case 0:
                return "צורך הרבה שמש";
              case 1:
                return "צורך אור חלש עד בינוני";
              case 2:
                return "צורך מעט שמש";
              default:
                return null;
            }
}
//מחזירה את אייקון הטמפרטורה המתאים למספר המייצג שקיבלה 
export function getTemperatureIcon(temperature) {
  switch (temperature) {
    case 0:
    case 1: return <ThermometerSnowflake className="icon temperature-icon" />;
    case 2:
    case 3: return <Thermometer className="icon temperature-icon" />;
    case 4:
    case 5: return <ThermometerSun className="icon temperature-icon" />;
    default: return null;
  }
}
//מחזירה את תיאור אייקון הטמפרטורה המתאים למספר המייצג שקיבלה
export function getTemperatureDesc(temperature){
          switch (temperature) {
              case 0:
              case 1:
                return "צורך טמפרטורה נמוכה";
              case 2:
              case 3:
                return "צורך טמפרטורה ממוצעת";
              case 4:
              case 5:
                return "צורך טמפרטורה גבוהה";
              default:
                return null;
            }
};
//מחזירה את אייקון ההשקיה המתאים למספר המייצג שקיבלה 
export function getIrrigationIcon(irrigation) {
  switch (irrigation) {
    case 0: return <Droplets className="icon irrigation-icon" />;
    case 1: return <DropletOff className="icon irrigation-icon" />;
    case 2: return <Droplet className="icon irrigation-icon" />;
    default: return null;
  }
}
//תיאור ההשקיה המתאים למספר המייצג שקיבלה
export function getIrrigationDesc(irrigation){
          switch (irrigation) {
              case 0:
                return "צורך השקיה מרובה";
              case 1:
                return "צורך מעט השקיה";
              case 2:
                return "צורך השקיה בינונית";
              default:
                return null;
            }
};
//מחזירה לכל עונה את הצבע המתאים לה
export function getSeasonColor(season) {
  switch (season) {
    case 0: return "#ffecb3"; // צהוב בהיר (קיץ)
    case 1: return "#e0f2f7"; // כחול בהיר (חורף)
    case 2: return "#c8e6c9"; // ירוק בהיר (אביב)
    case 3: return "#ffe0b2"; // כתום בהיר (סתיו)
    default: return "#ffffff"; // ברירת מחדל
  }
}

// אייקון כל העונות
export function AllSeasonsIcon() {
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
}


