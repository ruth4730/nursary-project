import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "./PlantCard.css";
import { useParams ,useNavigate} from "react-router-dom"; 
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import axios from "axios";
// import { Droplet, DropletOff, Droplets, Sun, SunDim, SunMedium, Thermometer, ThermometerSun, ThermometerSnowflake, Flower2, Snowflake, Leaf } from "lucide-react";
import { addToCart } from "../Cart/CartSlice";
import { fetchPlants, fetchPlantCharacterization } from "../Plant/ShowAllPlantsSlice";
import { getSeasonIcon,getSeasonDesc, getTemperatureIcon,getTemperatureDesc, getIrrigationIcon,getIrrigationDesc, getSeasonColor, getSunIcon ,getSunDesc,AllSeasonsIcon} from "./PlantIcons";
import { get } from "react-hook-form";
// import { saveCartToCookies } from "../Cart/Cart";  // import פונקציה לשמירה ב-Cookies
// import { loadCartFromCookies } from "../Cart/Cart";
import { addItemToCookieCart } from "../CartCookiesSlice";
import { updateCartInCookies } from "../Cart/Cart";

const PlantCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const plants = useSelector((state) => state.plants.listPlants);
  const listPlantCharacterization = useSelector((state) => state.plants.listPlantCharacterization);
  const cartItems = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.plants.status);
  const error = useSelector((state) => state.plants.error);
  const token = localStorage.getItem("token"); // אם יש טוקן משמירה
  
  useEffect(() => {
    document.body.classList.add("home-page");
    return () => {
      document.body.classList.remove("home-page"); // הסרת ה-class בעת יציאה מהעמוד
    };
  }, []);

  useEffect(() => {
    dispatch(fetchPlants());
    dispatch(fetchPlantCharacterization());
  }, [dispatch]);

  // פונקציה להוספת פריט לעגלה
  const handleAddToCart = () => {
    debugger
    if (token) {
      // עדכון העגלה ב-state של Redux
      dispatch(addToCart(plant));

      // עדכון העגלה ב-cookies
      updateCartInCookies(token, plant.plantCharacterizationId, "add");

      // אופציונלי: הודעה שהמוצר נוסף לעגלה
      alert(`${plant.name} נוסף לעגלה בהצלחה!`);
      // // עדכון העגלה ב-cookies
      // dispatch(addItemToCookieCart({ plant, token }));
    } else {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`); // הפנייה אם לא מחובר
    }
  };
  
  if (status === "loading") return <Typography variant="h5">טוען נתונים...</Typography>;
  if (error) return <Typography variant="h5" color="error">שגיאה בטעינת הנתונים</Typography>;
  if (!plants || plants.length === 0) return <Typography variant="h5">אין צמחים להצגה</Typography>;

  const plant = plants.find((x) => (x.id) === Number(id));
  if (!plant) return <Typography variant="h5">הצמח לא נמצא</Typography>;  
 
  const plantCharacterization=listPlantCharacterization.find((x)=>(x.id)== plant.plantCharacterizationId)
  if (!plantCharacterization) return <Typography variant="h5">אין אפיון לצמח זה</Typography>;
  
  // const quantityInCart = cartItems?.[plant?.name]?.quantity || 0;
  
  // בדיקה אם הצמח כבר נמצא בעגלה
  const quantityInCart = cartItems[plant.plantCharacterizationId]?.quantity || 0;
 
  return (
    <div className="main-container">
      <Box className="container-plant-card">
        <Box className="image-container">
          <Box className="image-box">
            <div className="plant-detail-img right-div">
              <img src={`data:image/jpg;base64,${plant.image}`} className="plant-detail-img" alt={plant.name} />
            </div>
          </Box>
        </Box>
        <Box className="content">
          <Typography variant="h2" className="plant-detail-name">{plant.name}</Typography>
          <Typography variant="h5" className="plant-price">מחיר: ₪{plant.price}</Typography>
          {/* <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            className="add-to-cart"
            onClick={handleAddToCart}>
            {quantityInCart > 0 ? `הוסף לעגלה (${quantityInCart} בעגלה)` : "הוסף לעגלה"}
            </Button>

            {quantityInCart > 0 && (
            <Typography variant="body2" style={{ margin: '10px 0', color: 'green' }}>
              המוצר נמצא בעגלה! כמות: {quantityInCart}
            </Typography> 
          )}*/}

          {plantCharacterization && (
            <>
            <div>
              <Paper elevation={3} className="info-box">
              <Typography variant="h6">
                   {getSunDesc(plantCharacterization?.sun)}
              </Typography>
              <div className="icon-container sun">
                  {getSunIcon(plantCharacterization?.sun)}
              </div>
              </Paper>
              <Paper elevation={3} className="info-box">
              <Typography variant="h6">
                   {getIrrigationDesc(plantCharacterization?.irrigation)}
              </Typography>
              <div className="icon-container irrigation">
                {getIrrigationIcon(plantCharacterization?.irrigation)}
              </div>
              </Paper>
              <Paper elevation={3} className="info-box">
              <Typography variant="h6">
                   {getTemperatureDesc(plantCharacterization?.temperature)}
              </Typography>           
              <div className="icon-container temperature">
                  {getTemperatureIcon(plantCharacterization?.temperature)}
              </div>
              </Paper>
              <Paper elevation={3} className="info-box">
              <Typography variant="h6">
                 {getSeasonDesc(plantCharacterization?.season)}
              </Typography>       
              <div className="icon-container-detail season"
               style={{ backgroundColor: getSeasonColor(plantCharacterization?.season) }}>
                 {getSeasonIcon(plantCharacterization?.season)}
              </div>
              </Paper>
              </div>
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default PlantCard;











// const PlantCard = () => {

//     const { id } = useParams();
//     const [plant, setPlant] = useState(null);
//     const [plantCharacterization, setPlantCharacterization] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     useEffect(() => {
//         axios.get(`https://localhost:7065/api/Plant/${id}`)
//           .then((response) => {
//             setPlant(response.data);
//             console.log(response.data);
//             setLoading(false);
//           })
//           .catch((error) => {
//             console.error("Error fetching plant data:", error);
//             setError("Failed to load plant data");
//             setLoading(false);
//           });
//       }, [id]);
      
//     useEffect(() => {
//         if (!plant || !plant.plantCharacterizationId) return; // מונע קריאה לפני שהנתונים זמינים
//         const x = axios.get(`https://localhost:7065/api/PlantCharacterization/${plant.plantCharacterizationId}`)  // שים את ה-API המתאים לקבלת כל התמונות
//         x.then((response) => {
//           console.log(response.data);
//           setPlantCharacterization(response.data); // שמירת הנתונים ב-state הנכון
//         }).catch((error) => {
//           console.error("Error fetching data:", error);
//         })
//     }, [plant]);

//     if (loading) {
//         return <Typography variant="h5">טעינה...</Typography>;
//     }

//     if (error) {
//         return <Typography variant="h5" color="error">{error}</Typography>;
//     }

//     const getSunIcon = (sun) => {
//         console.log("sun value:", sun); // להוסיף לוג כדי לבדוק את הערך של sun
//         switch (sun) {
//           case 0:
//             return <Sun className="icon sun-icon" />;
//           case 1:
//             return <SunDim className="icon sun-icon" />;
//           case 2:
//             return <SunMedium className="icon sun-icon" />;
//           default:
//             return null;
//         }
//       };
//     const getSunDesc=(sun)=>{
//         switch (sun) {
//             case 0:
//               return "צורך הרבה שמש";
//             case 1:
//               return "צורך אור חלש עד בינוני";
//             case 2:
//               return "צורך מעט שמש";
//             default:
//               return null;
//           }
//     }
//     const getIrrigationIcon = (irrigation) => {
//         switch (irrigation) {
//           case 0:
//             return <Droplets className="icon irrigation-icon" />;
//           case 1:
//             return <DropletOff className="icon irrigation-icon" />;
//           case 2:
//             return <Droplet className="icon irrigation-icon" />;
//           default:
//             return null;
//         }
//       };
//     const getIrrigationDesc=(irrigation)=>{
//         switch (irrigation) {
//             case 0:
//               return "צורך השקיה מרובה";
//             case 1:
//               return "צורך מעט השקיה";
//             case 2:
//               return "צורך השקיה בינונית";
//             default:
//               return null;
//           }
//     };
//     const getTemperatureIcon = (temperature) => {
//         switch (temperature) {
//           case 0:
//           case 1:
//             return <ThermometerSnowflake className="icon temperature-icon" />;
//           case 2:
//           case 3:
//             return <Thermometer className="icon temperature-icon" />;
//           case 4:
//           case 5:
//             return <ThermometerSun className="icon temperature-icon" />;
//           default:
//             return null;
//         }
//       };
//     const getTemperatureDesc=(temperature)=>{
//         switch (temperature) {
//             case 0:
//             case 1:
//               return "צורך טמפרטורה נמוכה";
//             case 2:
//             case 3:
//               return "צורך טמפרטורה ממוצעת";
//             case 4:
//             case 5:
//               return "צורך טמפרטורה גבוהה";
//             default:
//               return null;
//           }
//     };

//     const getSeasonIcon = (season) => {
//         switch (season) {
//           case 0:
//             return <Sun className="icon summer-icon" />;
//           case 1:
//             return <Snowflake className="icon winter-icon" />;
//           case 2:
//             return <Flower2 className="icon spring-icon" />;
//           case 3:
//             return <Leaf className="icon autumn-icon" />;
//           case 4:
//             return <AllSeasonsIcon />;
//           default:
//             return null;
//         }
//       };
//       const getSeasonDesc=(season)=>{
//         switch (season) {
//             case 0:
//               return "פורח בקיץ";
//             case 1:
//               return "פורח בחורף";
//             case 2:
//               return "פורח באביב";
//             case 3:
//               return "פורח בסתיו";
//             case 4:
//               return "פורח בכל העונות";
//             default:
//               return null;
//           }
//       };
//       const AllSeasonsIcon = () => {
//         return (
//           <div className="all-seasons-icon">
//             <div className="season-quarter top-left">
//               <Sun className="icon small-season-icon summer-icon" />
//             </div>
//             <div className="season-quarter top-right">
//               <Snowflake className="icon small-season-icon winter-icon" />
//             </div>
//             <div className="season-quarter bottom-left">
//               <Flower2 className="icon small-season-icon spring-icon" />
//             </div>
//             <div className="season-quarter bottom-right">
//               <Leaf className="icon small-season-icon autumn-icon" />
//             </div>
//           </div>
//         );
//       };

//       const getSeasonColor = (season) => {
//         switch (season) {
//           case 0:
//             return "#ffecb3"; // צהוב בהיר (קיץ)
//           case 1:
//             return "#e0f2f7"; // כחול בהיר (חורף)
//           case 2:
//             return "#c8e6c9"; // ירוק בהיר (אביב)
//           case 3:
//             return "#ffe0b2"; // כתום בהיר (סתיו)
//           default:
//             return "#ffffff"; // לבן (ברירת מחדל)
//         }
//       };
//   return (
//     <div className="main-container">
//     <Box className="container-plant-card">
//       <Box className="image-container">
//         <Box className="image-box">
//           <Typography color="textSecondary" variant="h6">
//           <div className="plant-detail-img right-div">
//             <img
//                 src={`data:image/jpg;base64,${plant.image}`}
//                 className="plant-detail-img"
//                 alt={plant.name}
//             />
//         </div>
//           </Typography>
//         </Box>
//       </Box>
//       <Box className="content">
//         {/* שם הצמח עם רווח גדול יותר */}
//         <Typography variant="h2" className="plant-detail-name">
//             {plant.name}
//         </Typography>

//         {/* מחיר הצמח */}
//         <Typography variant="h5" className="plant-price">
//           מחיר: ₪{plant.price}
//         </Typography>

//         {/* כפתור הוסף לעגלה */}
//         <Button 
//           variant="contained" 
//           color="primary" 
//           startIcon={<AddShoppingCartIcon />}
//           className="add-to-cart"
//         >
//           הוסף לעגלה
//         </Button>
//         {/* רווח במקום הכותרת "הוראות טיפול" */}
//         <Typography variant="h4">
//           {/* הכותרת הוסרה */}
//         </Typography>
//         <div>
//             <Paper elevation={3} className="info-box">
//             <Typography variant="h6">
//                 {getSunDesc(plantCharacterization?.sun)}
//             </Typography>
//             <div className="icon-container-detail sun">
//                 {getSunIcon(plantCharacterization?.sun)}
//             </div>
//             </Paper>
//             <Paper elevation={3} className="info-box">
//             <Typography variant="h6">
//                 {getIrrigationDesc(plantCharacterization?.irrigation)}
//             </Typography>
//             <div className="icon-container-detail irrigation">
//                 {getIrrigationIcon(plantCharacterization?.irrigation)}
//             </div>
//             </Paper>
//             <Paper elevation={3} className="info-box">
//             <Typography variant="h6">
//                 {getTemperatureDesc(plantCharacterization?.temperature)}
//             </Typography>
//             <div className="icon-container-detail temperature">
//                 {getTemperatureIcon(plantCharacterization?.temperature)}
//             </div>
//             </Paper>
//             <Paper elevation={3} className="info-box">
//             <Typography variant="h6">
//                 {getSeasonDesc(plantCharacterization?.season)}
//             </Typography>
//             <div className="icon-container-detail season"
//                 style={{ backgroundColor: getSeasonColor(plantCharacterization?.season) }}
//             >
//                 {getSeasonIcon(plantCharacterization?.season)}
//             </div>
//             </Paper>
//         </div>
//       </Box>
//     </Box>
//     </div>
//   );
// };

// export default PlantCard;
