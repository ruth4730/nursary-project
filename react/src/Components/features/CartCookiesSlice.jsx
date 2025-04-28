import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const loadCartFromCookies = (token) => {
    if (!token) return {};
    
    // חיפוש ה-cookie הספציפי של המשתמש
    // const cookies = document.cookie.split(';');
    // const cartCookie = cookies.find(cookie => cookie.trim().startsWith(`cart_${token}=`));
    
    //     if (cartCookie) {
//       try {
//         // פיענוח הערך המוצפן והמרתו בחזרה לאובייקט
//         const encodedCart = cartCookie.split('=')[1];
//         const cartJSON = atob(encodedCart);
//         return JSON.parse(cartJSON);
//       } catch (error) {
//         console.error("Error parsing cart from cookies:", error);
//         return {};
//       }
//     }
    
//     return {};
//   };
    const cartData = Cookies.get(`cart_${token}`);
    return cartData ? JSON.parse(cartData) : {};
};


// פונקציות עזר לניהול cookies
// export const saveCartToCookies = (token, cartItems) => {
//     if (!token) return;
    
//     // המרה של העגלה לפורמט JSON
//     const cartJSON = JSON.stringify(cartItems);
    
//     // המרה של המחרוזת ל-UTF-8 ואז ל-Base64
//     const encodedCart = btoa(encodeURIComponent(cartJSON));
    
//     // שמירת העגלה ב-cookies עם מפתח מבוסס על הטוקן
//     document.cookie = `cart_${token}=${encodedCart}; path=/; max-age=604800`; // תוקף של שבוע
//   };
export const saveCartToCookies = (token, items) => {
    if (!token) return;
    Cookies.set(`cart_${token}`, JSON.stringify(items), { expires: 7 });
  };

  // יצירת Thunk להוספת פריט לעגלה בקוקיז
export const addItemToCookieCart = createAsyncThunk(
    'cartCookies/addItem',
    async ({ plant, token }, { getState }) => {
      const currentCart = loadCartFromCookies(token);
      const plantId = plant.plantCharacterizationId;
      
      // עדכון כמות הפריט
      if (currentCart[plantId]) {
        currentCart[plantId].quantity += 1;
      } else {
        currentCart[plantId] = { 
          id: plantId, 
          name: plant.name, 
          price: plant.price,
          image: plant.image,
          quantity: 1 
        };
      }

      // שמירה בקוקיז
    saveCartToCookies(token, currentCart);
    
    return { cartItems: currentCart };
  }
);

// יצירת Thunk להסרת פריט מהעגלה בקוקיז
export const removeItemFromCookieCart = createAsyncThunk(
    'cartCookies/removeItem',
    async ({ plantId, token }, { getState }) => {
      const currentCart = loadCartFromCookies(token);
      
      if (currentCart[plantId]) {
        delete currentCart[plantId];
        saveCartToCookies(token, currentCart);
      }
      
      return { cartItems: currentCart };
    }
  );

  // יצירת Thunk להפחתת כמות פריט בעגלה בקוקיז
export const decreaseItemQuantityInCookieCart = createAsyncThunk(
    'cartCookies/decreaseQuantity',
    async ({ plantId, token }, { getState }) => {
      const currentCart = loadCartFromCookies(token);
      
      if (currentCart[plantId]) {
        if (currentCart[plantId].quantity > 1) {
          currentCart[plantId].quantity -= 1;
        } else {
          delete currentCart[plantId];
        }
        saveCartToCookies(token, currentCart);
      }
      
      return { cartItems: currentCart };
    }
  );
  
  const initialState = {
    items: {},
    status: 'idle',
    error: null
  };

  const cartCookiesSlice = createSlice({
    name: 'cartCookies',
    initialState,
    reducers: {
      // אתחול העגלה מהקוקיז
      initializeCart: (state, action) => {
        state.items = action.payload.cartItems || {};
      },
      // איפוס העגלה
      clearCart: (state) => {
        state.items = {};
      }
    },
    extraReducers: (builder) => {
      builder
        // תגובה להוספת פריט
        .addCase(addItemToCookieCart.fulfilled, (state, action) => {
          state.items = action.payload.cartItems;
          state.status = 'succeeded';
        })
        .addCase(addItemToCookieCart.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        
        // תגובה להסרת פריט
        .addCase(removeItemFromCookieCart.fulfilled, (state, action) => {
          state.items = action.payload.cartItems;
          state.status = 'succeeded';
        })
        
        // תגובה להפחתת כמות פריט
        .addCase(decreaseItemQuantityInCookieCart.fulfilled, (state, action) => {
          state.items = action.payload.cartItems;
          state.status = 'succeeded';
        });
    }
  });
  
  export const { initializeCart, clearCart } = cartCookiesSlice.actions;
  export default cartCookiesSlice.reducer;





// export const clearCartCookies = (token) => {
//   if (!token) return;
  
//   // מחיקת העגלה על ידי הגדרת פג תוקף בעבר
//   document.cookie = `cart_${token}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
// };

// יצירת slice עבור ניהול העגלה
// const cartCookiesSlice = createSlice({
//   name: "cartCookies",
//   initialState: {
//     items: {},
//     totalQuantity: 0,
//     totalAmount: 0
//   },
//   reducers: {
//     initializeCart: (state, action) => {
//       const { cartItems, totalQuantity, totalAmount } = action.payload;
//       state.items = cartItems;
//       state.totalQuantity = totalQuantity;
//       state.totalAmount = totalAmount;
//     },
//     addItemToCookieCart: (state, action) => {
//       const { plant, token } = action.payload;
//       const plantId = plant.id.toString();
      
//       // אם הפריט כבר קיים, הגדלת הכמות
//       if (state.items[plantId]) {
//         state.items[plantId].quantity += 1;
//       } else {
//         // אחרת, הוספת פריט חדש
//         state.items[plantId] = {
//           id: plant.id,
//           name: plant.name,
//           price: plant.price,
//           image: plant.image,
//           quantity: 1
//         };
//       }
      
//       // עדכון הסך הכולל
//       state.totalQuantity += 1;
//       state.totalAmount += plant.price;
      
//       // שמירה ב-cookies
//       saveCartToCookies(token, state.items);
//     },
//     removeItemFromCookieCart: (state, action) => {
//       const { plantId, token } = action.payload;
//       const id = plantId.toString();
      
//       if (state.items[id]) {
//         // עדכון הסך הכולל
//         state.totalQuantity -= state.items[id].quantity;
//         state.totalAmount -= state.items[id].price * state.items[id].quantity;
        
//         // מחיקת הפריט
//         delete state.items[id];
        
//         // שמירה ב-cookies
//         saveCartToCookies(token, state.items);
//       }
//     },
//     updateItemQuantity: (state, action) => {
//       const { plantId, quantity, token } = action.payload;
//       const id = plantId.toString();
      
//       if (state.items[id]) {
//         // חישוב ההפרש בכמות
//         const diff = quantity - state.items[id].quantity;
        
//         // עדכון הסך הכולל
//         state.totalQuantity += diff;
//         state.totalAmount += diff * state.items[id].price;
        
//         // עדכון כמות הפריט
//         state.items[id].quantity = quantity;
        
//         // אם הכמות היא 0, מחיקת הפריט
//         if (quantity <= 0) {
//           delete state.items[id];
//         }
        
//         // שמירה ב-cookies
//         saveCartToCookies(token, state.items);
//       }
//     },
//     clearCart: (state, action) => {
//       const { token } = action.payload;
      
//       // איפוס העגלה
//       state.items = {};
//       state.totalQuantity = 0;
//       state.totalAmount = 0;
      
//       // מחיקת ה-cookies
//       clearCartCookies(token);
//     }
//   }
// });

// export const { 
//   initializeCart, 
//   addItemToCookieCart, 
//   removeItemFromCookieCart, 
//   updateItemQuantity, 
//   clearCart 
// } = cartCookiesSlice.actions;

// export default cartCookiesSlice.reducer;