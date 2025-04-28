import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Badge } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate,useLocation } from "react-router-dom"; 
import { useSelector ,useDispatch} from "react-redux"; 
import "./Navbar.css";
import { loadCartFromCookies,initializeCart } from "../features/CartCookiesSlice";

const Navbar = () => {
  const navigate = useNavigate();  // הגדרת ה-navigate
  const location = useLocation(); // קבלת ה-location הנוכחי
  const dispatch=useDispatch();

  // קבלת הסך הכולל של פריטים בעגלה מ-Redux
  const totalQuantity = useSelector((state) => state.cartCookies.totalQuantity);
  const token = localStorage.getItem("token");

  // בעת טעינת הקומפוננטה, טעינת העגלה מה-cookies
  useEffect(() => {
    if (token) {
      // טעינת העגלה מה-cookies
      const cartItems = loadCartFromCookies(token);
      
      // חישוב הסך הכולל של פריטים וסכום העגלה
      let totalQuantity = 0;
      let totalAmount = 0;
      
      Object.keys(cartItems).forEach(key => {
        const item = cartItems[key];
        totalQuantity += item.quantity;
        totalAmount += item.price * item.quantity;
      });
      
      // עדכון ה-Redux store
      dispatch(initializeCart({ cartItems, totalQuantity, totalAmount }));
    }
  }, [token, dispatch]);

  // const handleCartClick = () => {
  //   if (token) {
  //       navigate("/cart");  // ניווט לדף העגלה
  //   }
  //   else{
  //     navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
  //   }
  // };

  const handleHomePageClick = () => {
    navigate('/')
  };
  const handleBackClick = () => {
    navigate(-1); // ניווט אחורה
  };
  const handleLoginClick=()=>{
    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
  };
  // אם אנחנו בדף הבית, נסתיר את החץ
  const isHomePage = location.pathname === "/";
  
  return (
    <AppBar position="fixed" className="navbar" elevation={0}>
      <Toolbar className="toolbar">
        <div className="left-section">
          <IconButton color="inherit" className="icon-button" disableRipple onClick={handleLoginClick}>
            <PersonIcon />
          </IconButton>
          {/* <IconButton color="inherit" className="icon-button" onClick={handleCartClick} disableRipple>
            <Badge badgeContent={totalQuantity} color="success">
              <ShoppingCartIcon />
            </Badge>
          </IconButton> */}
          <IconButton color="inherit" className="icon-button" disableRipple>
            <HomeIcon onClick={handleHomePageClick}/>
          </IconButton>
        </div>
          {/* הצגת החץ רק אם לא בדף הבית */}
          {!isHomePage && (
            <div className="right-section">
            <IconButton color="inherit" className="icon-button eastOutlinedIcon" onClick={handleBackClick} disableRipple>
              <EastOutlinedIcon />
            </IconButton>
            </div>
          )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
