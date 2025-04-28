import React ,{useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { Container, Grid, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import "./Order.css";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../CartCookiesSlice"; // Adjust the import path as needed

const Order = () => {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth); // Assuming you have an auth slice with token
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    notes: "",
    cardNumber: "",
    cvv: "",
    expiry: ""
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleHomePageClick = () => {
    navigate("/cart");  // ניווט לדף הבית
  };

  const handleOrderSubmit = () => {
    // Basic form validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || 
        !formData.address || !formData.city || !formData.cardNumber || !formData.cvv || !formData.expiry) {
      setSnackbar({
        open: true,
        message: "נא למלא את כל השדות החובה",
        severity: "error"
      });
      return;
  }

  dispatch(clearCart({ token: auth.token }));

   // Show success message
   setSnackbar({
    open: true,
    message: "ההזמנה התקבלה בהצלחה!",
    severity: "success"
  });

  setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container className="order-summary-container">
      <Typography variant="h4" className="order-title">סיום הזמנה</Typography>
      <br />
      <Grid container spacing={4}>
         {/* פרטי משלוח */}
         <Grid item xs={12} md={6}>
          <Card className="details-card">
            <CardContent>
              <Typography variant="h5" className="section-title">פרטי משלוח</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth label="שם פרטי" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field" required/></Grid>
                <Grid item xs={6}><TextField fullWidth label="שם משפחה" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field" required /></Grid>
                <Grid item xs={6}><TextField fullWidth label="טלפון" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" required /></Grid>
                <Grid item xs={6}><TextField fullWidth label="אימייל" name="email" value={formData.email} onChange={handleInputChange} className="input-field" required /></Grid>
                <Grid item xs={6}><TextField fullWidth label="כתובת" name="address" value={formData.address} onChange={handleInputChange} className="input-field" required /></Grid>
                <Grid item xs={6}><TextField fullWidth label="עיר" name="city" value={formData.city} onChange={handleInputChange} className="input-field" required /></Grid>
                <Grid item xs={6}><TextField fullWidth label="מיקוד" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="input-field" required /></Grid>
                <Grid item xs={6}><TextField fullWidth label="הערות להזמנה" name="notes" value={formData.notes} onChange={handleInputChange} multiline rows={3} className="input-field" /></Grid>
              </Grid>
              {/* <br /> */}
              {/* <Button variant="contained" color="primary" className="submit-button">סיים הזמנה</Button> */}
            </CardContent>
          </Card>
        </Grid>
        
        {/* סיכום הזמנה */}
        {/* <Grid item xs={12} md={6}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h5" className="section-title">סיכום הזמנה</Typography>
              {Object.values(cart.items).map((item) => (
                <div key={item.plantCharacterizationId} className="cart-item">
                  <Typography>{(item.price * item.quantity).toFixed(1)} ₪</Typography>
                  <Typography>{item.name} - {item.quantity}x</Typography>
                </div>
              ))}
              <hr />
              <div className="sum">
              <Typography>סכום ביניים: {(cart.totalPrice).toFixed(1)} ₪</Typography>
              <Typography>משלוח: {cart.shipping} ₪</Typography>
              <hr />
              <Typography variant="h6" className="total-price">סה"כ: {(cart.totalPrice + cart.shipping).toFixed(1)} ₪</Typography>
              <br />
              <Button variant="contained" color="primary" className="submit-button" onClick={handleHomePageClick}> חזרה לעגלת הקניות</Button>
            </div>
            </CardContent>
          </Card>
        </Grid> */}
    
    <Grid item xs={12} md={6}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h5" className="section-title">סיכום הזמנה</Typography>
              {Object.values(cart.items).length > 0 ? (
              Object.values(cart.items).map((item) => (
                <div key={item.id} className="cart-item">
                  <Typography>{(item.price * item.quantity).toFixed(1)} ₪</Typography>
                  <Typography>{item.name} - {item.quantity}x</Typography>
                </div>
              ))
            ):(
              <Typography>העגלה ריקה</Typography>
            )}
              <hr />
              <div className="sum">
                <Grid container justifyContent="space-between">
                  <Grid item xs={6} className="right-txt"><Typography>סכום ביניים:</Typography></Grid>
                  <Grid item xs={6}  className="left-txt"><Typography>{(cart.totalPrice||0).toFixed(1)} ₪</Typography></Grid>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid item xs={6} className="right-txt"><Typography>משלוח:</Typography></Grid>
                  <Grid item xs={6} className="left-txt"><Typography>{cart.shipping||0} ₪</Typography></Grid>
                </Grid>
                <hr />
                <Grid container justifyContent="space-between">
                  <Grid item xs={6} className="right-txt"><Typography variant="h6" className="total-price">סה"כ:</Typography></Grid>
                  <Grid item xs={6} className="left-txt">
                    <Typography variant="h6" className="total-price">
                      {((cart.totalPrice ||0)+ (cart.shipping || 0)).toFixed(1)} ₪</Typography></Grid>
                </Grid>
              </div>
              <br />
              <Button 
                variant="contained" 
                color="primary" 
                className="submit-button"
                onClick={handleBackToCartClick}
              >
                חזרה לעגלת הקניות
              </Button>          
            </CardContent>
          </Card>
        </Grid>


      {/* אמצעי תשלום */}
        <Grid item xs={12} md={6}>
          <Card className="payment-card">
            <CardContent>
              <Typography variant="h5" className="section-title">תשלום</Typography>
              <Grid container spacing={2}>
                {/* <Grid item xs={12}><Typography>כרטיס אשראי</Typography></Grid>
                <Grid item xs={12}><Typography>PayPal</Typography></Grid>
                <Grid item xs={12}><Typography>העברה בנקאית / Bit</Typography></Grid> */}
                <Grid item xs={12}><TextField fullWidth label="מספר כרטיס" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="input-field" placeholder="__ __ __ __ - __ __ __ __ -__ __ __ __ - __ __ __ __" required /></Grid>
                <Grid container spacing={2} marginTop={2}>
                  <Grid item xs={5}><TextField fullWidth label="CVV" name="cvv" value={formData.cvv} onChange={handleInputChange} className="input-field" required/></Grid>
                  <Grid item xs={5}><TextField fullWidth label="תוקף" name="expiry" value={formData.expiry} onChange={handleInputChange} className="input-field" placeholder="__/__" /></Grid>
                </Grid>
              </Grid>
              <br />
              <Button variant="contained" color="primary" className="submit-button" onClick={handleOrderSubmit} disabled={Object.values(cart.items).length===0}>אישור הזמנה</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Order;
