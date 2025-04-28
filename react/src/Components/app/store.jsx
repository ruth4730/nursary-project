import { configureStore } from "@reduxjs/toolkit";
import plantReducer from "../features/Plant/ShowAllPlantsSlice";
import cartReducer from "../features/Cart/CartSlice";
import userReducer from "../features/User/UserSlice"
import cartCookiesReducer from "../features/CartCookiesSlice"
export const store = configureStore({
  reducer: {
    plants: plantReducer,
    cart: cartReducer,
    user: userReducer, 
    cartCookies: cartCookiesReducer,
  },
});
