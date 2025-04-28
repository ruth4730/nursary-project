import React from "react";
import { Button, Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, decreaseQuantity } from "./CartSlice";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Cookies from "js-cookie";
import { useEffect,useState } from "react";
import { fetchPlants, fetchPlantCharacterization } from "../Plant/ShowAllPlantsSlice";
import { initializeCart } from "../CartCookiesSlice";
import { loadCartFromCookies } from "../CartCookiesSlice";
// פונקציות ניהול העגלה
export const saveCartToCookies = (token, cartItems) => {
  if (!token) return;
  Cookies.set(`cart_${token}`, JSON.stringify(cartItems), { expires: 7 });
};

// export const loadCartFromCookies = (token) => {
//   if (!token) return {};
//   const cartData = Cookies.get(`cart_${token}`);
//   return cartData ? JSON.parse(cartData) : {};
// };

export const updateCartInCookies = (token, productId, action) => {
  if (!token) return;
  let cart = loadCartFromCookies(token);
  if (action === "add") {
    cart[productId] = (cart[productId] || 0) + 1;
  } else if (action === "remove") {
    if (cart[productId]) {
      cart[productId]--;
      if (cart[productId] === 0) {
        delete cart[productId];
      }
    }
  }else if (action==="delete"){
    delete cart[productId]
  }
  saveCartToCookies(token, cart);
  return cart
};

export const clearCartAfterPurchase = (token) => {
  if (!token) return;
  Cookies.remove(`cart_${token}`);
};

export const getTotalCartItems = (token) => {
  const cart = loadCartFromCookies(token);
  return Object.values(cart).reduce((total, qty) => total + qty, 0);
};


const EmptyCart = () => {
  const navigate = useNavigate(); // הוספת ה-navigate
  const handleContinueShopping = () => {
    navigate("/"); // ניווט לדף הבית
  };
  return (
    <Box className="empty-cart-container">
      <ShoppingCartOutlinedIcon className="empty-cart-icon"/>
      <Typography variant="h5" className="empty-cart-title">העגלה שלך ריקה</Typography>
      <Typography variant="body2" className="empty-cart-text">לא נמצאו פריטים בעגלת הקניות שלך</Typography>
      <Button 
        variant="contained" 
        color="success" 
        className="cart-button" 
        onClick={handleContinueShopping} // ניווט לדף הבית
      >
        המשך בקניות
      </Button>   
     </Box>
  );
};

const CartItem = ({item}) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token"); // טוען את הטוקן מה-localStorage
  const handleIncreaseQuantity = () => {
    dispatch(addToCart(item));
    updateCartInCookies(token, item.plantCharacterizationId, "add");
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseQuantity(item.plantCharacterizationId));
    updateCartInCookies(token, item.plantCharacterizationId, "remove");
  };

  const handleRemoveItem = () => {
    dispatch(removeFromCart(item.plantCharacterizationId));
    updateCartInCookies(token, item.plantCharacterizationId, "delete");
  };

  return (
    <Card className="cart-item">
      <Box>
      {/* <div className="plant-detail-img right-div-cart">
          <img src={`data:image/jpg;base64,${item.image}`} alt={item.name} className="cart-img"/>
        </div>
        <Typography variant="h6" className="cart-item-image">
          <div className="plant-detail-img right-div-cart">
            <img src={`data:image/jpg;base64,${item.image}`}  alt={item.name} className="cart-img"/>
          </div>
        </Typography> */}
      </Box>
      <Box>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body2">{`₪${(item.price)?.toFixed(1)}`}</Typography>
      </Box>
      <Box className="cart-item-controls">
        <IconButton onClick={handleDecreaseQuantity}>-</IconButton>
        <Typography>{item.quantity}</Typography>
        <IconButton onClick={handleIncreaseQuantity}>+</IconButton>
      </Box>
      <Typography variant="h6">{`₪${(item.price * item.quantity)?.toFixed(1)}`}</Typography>
      <IconButton onClick={handleRemoveItem}>
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

const CartSummary = ({ totalPrice, shipping }) => {
  const navigate = useNavigate();  // הגדרת ה-navigate

  const handleOrderClick = () => {
    navigate("/order");  // ניווט לדף הבית
};
  return (
    <Card className="cart-summary-box">
      <Typography variant="h5">סיכום הזמנה</Typography>
      <Typography>סכום ביניים: ₪{totalPrice.toFixed(1)}</Typography>
      <Typography>משלוח: ₪{shipping}</Typography>
      <Typography variant="h6" className="total-price">סה״כ: ₪{(totalPrice + shipping).toFixed(1)}</Typography>
      <Button variant="contained" color="success" fullWidth onClick={handleOrderClick}>המשך לתשלום</Button>
    </Card>
  );
};

// const Cart = () => {
//   // const  items  = useSelector((state) => state.cart.items);
//   // const [cartItems, setCartItems] = useState([]);
//   // console.log("items",items)
//   const token = localStorage.getItem("token");
//   const dispatch=useDispatch();

//   useEffect(() => {
//       dispatch(fetchPlants());
//       dispatch(fetchPlantCharacterization());
//     }, [dispatch]);

//     const plants = useSelector((state) => state.plants.listPlants);
//     console.log(plants);
//   useEffect(() => {
//     if (token /*&& plants.length>0*/)
//     {
//       debugger
//       const cartData = loadCartFromCookies(token) || {};
//       dispatch(initializeCart({ 
//         cartItems: cartData, 
//         totalQuantity: Object.values(cartData).reduce((sum, item) => sum + item.quantity, 0),
//         totalAmount: Object.values(cartData).reduce((sum, item) => sum + item.price * item.quantity, 0),
//         }));
//       }
//     }, [token, dispatch]);
//     debugger
//     const cartItems = useSelector((state) => state.cartCookies.items);

//       // const plantIds = Object.keys(cartData);  // מפתחי המוצרים
//       // const updatedItems = [];
//       // plantIds.forEach((id) => {
//       //   // יש לך גישה למידע על כל צמח כאן
//       //   // נניח שצמחים נמצאים במאגר צמחים גלובלי
//       //   const plant = plants.find((x) => (x.id) === Number(id)); // פונקציה שמחזירה את הצמח לפי id
//       //   if (plant) {
//       //     const quantity = cartData[id];
//       //     updatedItems.push({ ...plant, quantity });
//       //   }
//       // });

//   //     setCartItems(updatedItems);
//   //   }
//   // }, [token,plants]);

//   // if (!cartItems.length) {
//   //   return <EmptyCart />;
//   // }
//   // if (Object.keys(items).length === 0) {
//   //   return <EmptyCart />;
//   // }
//   return (
//     // <>
//     //   <h1 className="catr-title">עגלת קניות</h1>
//     //   <Box className="cart-container">
//     //     <Box className="cart-items">
//     //     {/* {Object.values(items).map((item) => ( // הפיכת ה-Object למערך
//     //         <CartItem key={item.plantCharacterizationId} item={item} />
//     //       ))} */}
//     //        {cartItems.map((item) => (
//     //         <CartItem key={item.plantCharacterizationId} item={item} quantity={item.quantity} />
//     //       ))}
//     //     </Box>       
//     //     <Box>
//     //         <div className="cart-summary-pading">        
//     //           <CartSummary />
//     //         </div>
//     //     </Box>

//     //     {/* <Box className="cart-summary-box">
//     //     </Box> */}
//     //   </Box>
//     // </>
//     <div>
//       <h2>העגלה שלך</h2>
//       {Object.keys(cartItems).length === 0 ? (
//         <p>העגלה ריקה</p>
//       ) : (
//         <ul>
//           {Object.values(cartItems).map((item) => (
//             <li key={item.id}>
//               {item.name} - כמות: {item.quantity} - מחיר: {item.price * item.quantity} ₪
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
// // export { saveCartToCookies, loadCartFromCookies, updateCartInCookies, clearCartAfterPurchase, getTotalCartItems };
// export default Cart;
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  
  // נתונים מהסטור
  const items = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const shipping = useSelector((state) => state.cart.shipping);
  const plants = useSelector((state) => state.plants.listPlants);
  const plantCharacterizations = useSelector((state) => state.plants.listPlantCharacterization);
  
  // טעינת הצמחים ואפיון הצמחים
  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchPlants());
      await dispatch(fetchPlantCharacterization());
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);
  
  // טעינת עגלה מהקוקיז ועדכון הסטור
  useEffect(() => {
    if (token && plants.length > 0 && plantCharacterizations.length > 0) {
      const cartData = loadCartFromCookies(token);
      
      // עדכון עגלה בסטור
      Object.keys(cartData).forEach(plantCharId => {
        const quantity = cartData[plantCharId];
        const plantInfo = plantCharacterizations.find(pc => pc.id === Number(plantCharId));
        
        if (plantInfo) {
          // מצא את הצמח המתאים לאפיון
          const plant = plants.find(p => p.plantCharacterizationId === Number(plantCharId));
          if (plant) {
            // הוסף את הצמח לעגלה מספר פעמים לפי הכמות
            for (let i = 0; i < quantity; i++) {
              dispatch(addToCart({
                ...plant,
                plantCharacterizationId: Number(plantCharId)
              }));
            }
          }
        }
      });
    }
  }, [token, plants, plantCharacterizations, dispatch]);

  if (isLoading) {
    return <Typography variant="h5">טוען נתונים...</Typography>;
  }

  // אם העגלה ריקה
  if (Object.keys(items).length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <h1 className="catr-title">עגלת קניות</h1>
      <Box className="cart-container">
        <Box className="cart-items">
          {Object.values(items).map((item) => (
            <CartItem key={item.plantCharacterizationId} item={item} />
          ))}
        </Box>       
        <Box>
          <div className="cart-summary-pading">        
            <CartSummary totalPrice={totalPrice} shipping={shipping} />
          </div>
        </Box>
      </Box>
    </>
  );
};
// export const {updateCartInCookies}
export default Cart;