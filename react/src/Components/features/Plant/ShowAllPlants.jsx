import { useEffect,useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlants, fetchPlantCharacterization,fetchPlantFiltered } from "../Plant/ShowAllPlantsSlice";
//import SearchBox from "./SearchBox";
import { getSeasonIcon, getTemperatureIcon, getIrrigationIcon, getSeasonColor, getSunIcon } from "./PlantIcons";
import "./Styles.css"
import { Search } from "lucide-react";
import axios from "axios";

export default function ShowAllPlants() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const [tableTop, setTableTop] = useState("40%"); // מיקום התחלתי של הטבלה
  const { listPlants, listPlantCharacterization, status, error } = useSelector(
    (state) => state.plants
  );
  const { listPlantFiltered } = useSelector((state) => state.plants);
  const[isVisibleAll,setIsVisibleAll]=useState(true);
  const[isVisibleFiltered,setIsVisibleFiltered]=useState(false);
  const handleClickSearch = async (event) => {
    const text = inputRef.current.value
      await dispatch(fetchPlantFiltered(text)); // העברת הטקסט שנרשם בתיבת החיפוש
      // שינוי מצב ההסתרה
      setIsVisibleAll(false);
      setIsVisibleFiltered(true);   
  };
  const reduxState = useSelector((state) => state);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      const searchBoxHeight = inputRef.current.parentElement.offsetHeight; // גובה תיבת החיפוש
      setTableTop(`${searchBoxHeight + 200}px`); // רווח של 20px מתחת לתיבת החיפוש
    }
  }, [text]);

  const handleChange = (event) => {
    setText(event.target.value);
  }
  useEffect(() => {
    dispatch(fetchPlants());
    dispatch(fetchPlantCharacterization());
  }, [dispatch]);

{/*useEffect(()=>{
    dispatch(fetchPlantFiltered());
  },[dispatch]);*/}

  useEffect(() => {
    console.log("Redux state:", listPlants, listPlantCharacterization);
}, [listPlants, listPlantCharacterization]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Error fetching plants: {error}</p>;

  return (
    <div>
      <div className="search-box">
        <button className="search-button" onClick={handleClickSearch}>
          <Search className="search-icon" />
        </button>
        <textarea
          ref={inputRef} // חיבור ה-ref לתיבת הטקסט
          placeholder="חפש צמח"
          className="search-input"
          value={text}
          onChange={handleChange}
          rows={1}//התחלה עם שורה אחת
        />
       
      </div>
      {isVisibleAll &&<div className="plant-cards-grid" style={{top:tableTop}}>
        {Array.isArray(listPlants) && listPlants.map((plant) => (
          <div className="plant-card" key={plant.id} onClick={() => navigate(`/plant/${plant.id}`)}>            
            <img src={`data:image/jpg;base64,${plant.image}`} className="plant-image" alt={plant.name} />
            <div className="plant-name">{plant.name}</div>
            <hr className="plant-separator" />
            <div className="plant-info">
              {/* {listPlantCharacterization && listPlantCharacterization[plant.plantCharacterizationId] && ( */}
                <>
                  <div className="icon-container sun">
                    {getSunIcon((listPlantCharacterization.find(x=>x.id == plant.plantCharacterizationId))?.sun)}
                  </div>
                  <div className="icon-container irrigation">
                    {getIrrigationIcon((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.irrigation)}
                  </div>
                  <div className="icon-container temperature">
                    {getTemperatureIcon((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.temperature)}
                  </div>
                  <div
                    className="icon-container season"
                    title={`עונה: ${["קיץ", "חורף", "אביב", "סתיו"][listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId)?.season]}`}
                    style={{ backgroundColor: getSeasonColor((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.season) }}
                  >
                    {getSeasonIcon((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.season)}
                  </div>
                </>
              {/* )} */}
            </div>
          </div>
        ))}
      </div>}

      {/*מציג את נתוני הפרחים המסוננים ע"י האלגוריתם*/}

      {isVisibleFiltered &&(
      <div className="plant-cards-grid" style={{top:tableTop}}>
        {Array.isArray(listPlantFiltered) && 
        listPlantFiltered.map((plant) => (
          <div className="plant-card"
          key={plant.id} 
          onClick={() => navigate(`/plant/${plant.id}`)}>            
            <img src={`data:image/jpg;base64,${plant.image}`} className="plant-image" alt={plant.name} />
            <div className="plant-name">{plant.name}</div>
            <hr className="plant-separator" />
            <div className="plant-info">
              {/* {listPlantCharacterization && listPlantCharacterization[plant.plantCharacterizationId] && ( */}
                <>
                  <div className="icon-container sun">
                    
                    {console.log("plant",plant,"plantId",plant.id)}
                    {console.log("find char....",listPlantCharacterization.find(x=>x.id == plant.plantCharacterizationId))}
                    {getSunIcon((listPlantCharacterization.find(x=>x.id == plant.plantCharacterizationId))?.sun)}
                  </div>
                  <div className="icon-container irrigation">
                    {getIrrigationIcon((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.irrigation)}
                  </div>
                  <div className="icon-container temperature">
                    {getTemperatureIcon((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.temperature)}
                  </div>
                  <div
                    className="icon-container season"
                    title={`עונה: ${["קיץ", "חורף", "אביב", "סתיו"][listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId)?.season]}`}
                    style={{ backgroundColor: getSeasonColor((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.season) }}
                  >
                    {getSeasonIcon((listPlantCharacterization.find(x=>x.id == plant?.plantCharacterizationId))?.season)}
                  </div>
                </>
              {/* )} */}
            </div>
          </div>
        ))}
      </div>)}
    </div>
  );
}
