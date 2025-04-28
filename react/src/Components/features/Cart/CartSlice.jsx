import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {}, // מפתח: שם הצמח, ערך: { פרטי הצמח, כמות }
  totalQuantity: 0, // כמות הפריטים הכוללת בעגלה
  totalPrice: 0, // סכום ההזמנה הכולל
  shipping: 30, // משלוח קבוע
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const plant = action.payload;
      //לשנות ל-id!!!
      const plantId = plant.plantCharacterizationId; // משתמשים במיקום במערך כמפתח
      if (state.items[plantId]) {
        state.items[plantId].quantity += 1; // עדכון הכמות
      } else {
        state.items[plantId] = { ...plant, quantity: 1 }; // הוספת הצמח עם כמות 1
      }
      state.totalQuantity += 1; // עדכון כמות הפריטים הכוללת
      state.totalPrice += Number(plant.price || 0); // עדכון המחיר הכולל
    },
    removeFromCart: (state, action) => {
      const plantId = action.payload;
      if (state.items[plantId]) {
        const plantPrice = Number(state.items[plantId].price || 0);
        const plantQuantity = state.items[plantId].quantity;

        // עדכון הסכום והכמות
        state.totalQuantity -= plantQuantity;
        state.totalPrice -= plantPrice * plantQuantity;
        // מחיקת הצמח
        delete state.items[plantId];
      }
    },
    decreaseQuantity: (state, action) => {
      const planId = action.payload;
      if (state.items[planId]) {
        const plant = state.items[planId];
        if (plant.quantity > 1) {
          plant.quantity -= 1;
          state.totalQuantity -= 1;
          state.totalPrice -= Number(plant.price || 0);
        } else {
          // אם הכמות יורדת ל-0, נמחק את הצמח
          state.totalQuantity -= 1;
          state.totalPrice -= Number(plant.price || 0);
          delete state.items[planId];
        }
      }
    },
    initializeCart: (state, action) => {
      return {
        ...state,
        items: action.payload.items || {},
        totalQuantity: action.payload.totalQuantity || 0,
        totalPrice: action.payload.totalPrice || 0
      };
    },
    
    // איפוס העגלה
    clearCart: (state) => {
      state.items = {};
      state.totalQuantity = 0;
      state.totalPrice = 0;
    }
  },
});

export const { addToCart, removeFromCart, decreaseQuantity,initializeCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;








// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   // items: [
//   //   { id: 1, name: "פוטוס זהוב", price: 69, quantity: 4 },
//   //   { id: 2, name: "פיקוס לירה", price: 189, quantity: 1 },
//   //   { id: 3, name: "סטפיליפילום (שושן שלום)", price: 89, quantity: 1 },
//   //   { id: 4, name: "אלורה", price: 59, quantity: 1 },
//   // ],
//   // total: 732,
//   // shipping: 30,
//   items: {}, // מפתח: מזהה הצמח, ערך: { פרטי הצמח, כמות }
//   totalQuantity: 0, // כמות הפריטים הכוללת בעגלה
//   total: 0, // סכום המחיר הכולל של כל הצמחים בעגלה
//   shipping: 30, // דמי משלוח קבועים
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const plant = state.plant;
//       if (state.items[plant.id]) {
//         state.items[plant.id].quantity += 1;
//       } else {
//         state.items[plant.id] = { ...plant, quantity: 1 };
//       }
//       state.totalQuantity += 1;//עדכון כמות הפריטים
//       // עדכון הסכום הכולל של כל הצמחים בעגלה
//       state.total = Object.values(state.items).reduce(
//         (total, item) => total + item.price * item.quantity,
//         0
//       );},
//     removeFromCart: (state, action) => {
//       const plantId = action.payload;
//       if (state.items[plantId]) {
//         // עדכון כמות הפריטים הכוללת
//         state.totalQuantity -= state.items[plantId].quantity;
//          // הסרת הצמח מהעגלה
//         delete state.items[plantId];
//       }
//       // עדכון הסכום הכולל של כל הצמחים בעגלה
//       state.total = Object.values(state.items).reduce(
//         (total, item) => total + item.price * item.quantity,
//         0
//       );
//     },
//     decreaseQuantity: (state, action) => {
//       const plantId = action.payload;
//       if (state.items[plantId]) {
//          // הפחתת כמות הצמח בעגלה
//         state.items[plantId].quantity -= 1;
//         state.totalQuantity -= 1; // עדכון כמות הפריטים הכוללת
//         if (state.items[plantId].quantity === 0) {
//           delete state.items[plantId];
//         }
//         state.total = Object.values(state.items).reduce(
//           (total, item) => total + item.price * item.quantity,
//           0
//         );
//       }
//     },
//   },
// });

// export const { addToCart, removeFromCart, decreaseQuantity } = cartSlice.actions;
// export default cartSlice.reducer;

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     increment: (state, action) => {
//       const item = state.items.find((item) => item.id === action.payload);
//       if (item) {
//         item.quantity += 1;
//         state.total += item.price;
//       }
//     },
//     decrement: (state, action) => {
//       const item = state.items.find((item) => item.id === action.payload);
//       if (item && item.quantity > 1) {
//         item.quantity -= 1;
//         state.total -= item.price;
//       }
//     },
//     removeItem: (state, action) => {
//       const item = state.items.find((item) => item.id === action.payload);
//       if (item) {
//         state.total -= item.price * item.quantity;
//         state.items = state.items.filter((item) => item.id !== action.payload);
//       }
//     },
//   },
// });

// export const { increment, decrement, removeItem } = cartSlice.actions;
// export default cartSlice.reducer;
