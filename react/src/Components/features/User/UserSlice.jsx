import { LineAxisOutlined } from "@mui/icons-material";
import { createAsyncThunk, current, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

export const signInServer=createAsyncThunk(
    "user-SignIn",
    async(User,thunkApi)=>{
        try{
            let {data}=await axios.post(
                "https://localhost:7065/api/User/SignIn",
                User
            );
            console.log("Response from server:", data);
            if(data){
              localStorage.setItem("token", data);
              return data;  // החזרת הטוקן במקום כל האובייקט
            }
            else{
                console.log("Token not received:", data);
                return thunkApi.rejectWithValue("Token not received");
              }
        }
        catch(error) {
            console.error("Error during SignIn:", error);
            return thunkApi.rejectWithValue(error);
          }
    }
);
//פונקציה שמחלצת את הנתונים מהטוקן
function parseJwt() {
    const t = localStorage.getItem("token");
    console.log("Token in localStorage:", t);
    if (!t) {
      console.error("No token found in localStorage");
      return null;
    }
  
    try {
      const base64Url = t.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
}
// תפקיד: להוסיף משתמש חדש למערכת
export const register = createAsyncThunk("user/register", async (user, thunkApi) => {
  try {      
      const response = await fetch("https://localhost:7065/api/User/SignUp", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: user.email,
            password: user.password,
            alert: user.alert
        }),
        
      });
      if (!response.ok) {
        const errorText = await response.text();
            throw new Error(`Server error: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ User registered successfully:", data);
        return data;
    } catch (error) {
        console.error("Error in register API:", error);
        return thunkApi.rejectWithValue(error.message);
    }
});
//פונקציה ששולפת את כל המשתמשים הרשומים
export const GetAllUsers=createAsyncThunk("user/GetAllUsers",async()=>{
  try{
      const response=await axios.get("https://localhost:7065/api/User");
      console.log(response.data);
      return response.data;
  }catch(error){
    console.error("Error fetching data:", error);
    throw error;
  }
});

export const userSlice=createSlice({
    name:'user',
    initialState:{
        currentUser:parseJwt() || null,
        token: localStorage.getItem("token") || null,
        status:null,
        groups:[],
        message:null,
        allUsers: [], // נוכל לשמור את כל המשתמשים כאן
    },
    reducers:{setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token"); // מחיקת הטוקן בעת התנתקות
    },
  },
    extraReducers: (builder) => {
        builder.addCase(signInServer.fulfilled, (state, action) => {
          state.token = action.payload; // שמירת הטוקן בסטור
          // state.currentUser = parseJwt(); // חילוץ המשתמש מהטוקן ושמירתו
          localStorage.setItem("token", action.payload); // שמירה ב-localStorage
          // const payload = parseJwt(); // חילוץ הנתונים מהטוקן
          // console.log("Parsed User Payload:", payload); // ודאי שהפענוח עובד
          state.currentUser = parseJwt(); // שמירת הנתונים ב-Redux
          state.message = "התחברת בהצלחה";
          state.status = "success";
        }).addCase(signInServer.rejected, (state, action) => {
          state.status = "failed";
          state.message = "ישנה תקלה בהתחברות";
        }).addCase(signInServer.pending, (state, action) => {
          state.status = "loading";
          state.message = "מתבצעת התחברות";
        }).addCase(register.fulfilled, (state, action) => {
          state.currentUser = action.payload;
          state.message = "התחברת בהצלחה";
          state.status = "success";
        }).addCase(register.rejected, (state, action) => {
          state.status = "failed";
          state.message = "ישנה תקלה בהתחברות";
        }).addCase(register.pending, (state, action) => {
          state.status = "loading";
          state.message = "מתבצעת התחברות";
        }).addCase(GetAllUsers.fulfilled, (state, action) => {
          state.allUsers = action.payload; // שמירת כל המשתמשים
        });
    },
    });
    
export const { login ,setToken,logout} = userSlice.actions
export default userSlice.reducer
