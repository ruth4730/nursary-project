import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//import { build } from "vite";

// פעולה אסינכרונית להבאת הצמחים מה-API
export const fetchPlants = createAsyncThunk("plants/fetchPlants", async () => {
    console.log("📡 מבצע קריאה ל-API...");
  try {
    const response = await axios.get("https://localhost:7065/api/Plant");
    console.log(response.data);
    return response.data;
 } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
 }
});

// פעולה אסינכרונית להבאת אפיון הצמחים
export const fetchPlantCharacterization = createAsyncThunk("plants/fetchPlantCharacterization",async () => {
    try{
        const response = await axios.get("https://localhost:7065/api/PlantCharacterization");
        console.log("fetchPlantCharacterization slice",response.data);
        return response.data;
    } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
    }
  }
);
//פעולה אסינכרונית להבאת הצמחים המסוננים ע"י האלגוריתם
// export const fetchPlantFiltered = createAsyncThunk(
//     "plants/fetchPlantFiltered",
//     async (searchText) => {
//     try{
//         const response = await axios.post("https://localhost:7065/api/Algorithem",{
//         searchText,
//         });
//         console.log("fetchPlantFiltered slice",response.data);
//         return response.data;
//     } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//     }
//   }
// );
export const fetchPlantFiltered = createAsyncThunk(
    "plants/fetchPlantFiltered",
    async (searchText) => {
      try {
        console.log("שולח חיפוש:", searchText);
        
        // שלח את הטקסט ישירות כמחרוזת, בתוך מרכאות כפולות
        const response = await axios.post(
          "https://localhost:7065/api/Algorithem", 
          JSON.stringify(searchText), // חשוב: שלח את הטקסט כמחרוזת JSON
          {
            headers: {
              'Content-Type': 'application/json'  // חשוב: הגדר את סוג התוכן
            }
          }
        );
        
        console.log("fetchPlantFiltered slice", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  );
const ShowAllPlantsSlice = createSlice({
    name: "plants",
    initialState: {
        listPlants: [],
        listPlantCharacterization: [],
        listPlantFiltered:[],
        status: null,
        error: null,
    },
    reducers: {},
    extraReducers:(builder)=>{
        builder.addCase(fetchPlants.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchPlants.fulfilled, (state, action) => {
            console.log("✅ צמחים נטענו בהצלחה:", action.payload);
            state.status = "success plants";
            state.listPlants = action.payload;
        })
        .addCase(fetchPlants.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
        .addCase(fetchPlantCharacterization.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchPlantCharacterization.fulfilled, (state, action) => {
            console.log("✅ אפיון הצמחים נטען בהצלחה:", action.payload);
            console.log("🚀 Characterization Data Fetched:", action.payload);
            state.listPlantCharacterization = action.payload;
            state.status = "success listPlantCharacterization";
        })
        .addCase(fetchPlantCharacterization.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
        .addCase(fetchPlantFiltered.pending, (state) => {
            state.status = "loading filtered";
        })
        .addCase(fetchPlantFiltered.fulfilled, (state, action) => {
            console.log("✅ צמחים מסוננים נטענו בהצלחה:", action.payload);
            state.listPlantFiltered = action.payload;
            state.status = "success filtered";
        })
        .addCase(fetchPlantFiltered.rejected, (state, action) => {
            state.status = "failed filtered";
            state.error = action.error.message;
        });
    },
});
export default ShowAllPlantsSlice.reducer;
