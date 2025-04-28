import  React from 'react';
import { useState ,useEffect} from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme } from '@mui/material/styles';
import { login, signInServer } from './UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Checkbox, FormControlLabel,Box } from '@mui/material';
import { setToken } from "./UserSlice";  // ייבוא setToken
import { loadCartFromCookies } from "../CartCookiesSlice";
import { initializeCart } from "../CartCookiesSlice";
// providers for authentication
// const providers = [{ id: 'credentials', name: 'Email and Password' }];

// const signIn = async (provider, formData) => {
//   const email = formData.get('email');
//   const password = formData.get('password');

//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 300);
//   });
// };

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [redirectPath] = useState(params.get("redirect") || "/");  // הוספת useState כדי לשמור על הערך
  const [errors, setErrors] = useState({ email: '', password: '' });

   //הגדרת משתנה לקבלת הטוקן מהסטור
   const token = useSelector((state) => state.user ? state.user.token : null);
   //הגדרת משתנה לניווט בין הדפים
   const navigate = useNavigate();
  //הגדרת משתנה לשליחת פעולות לסטור
  const dispatch = useDispatch();
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto'; // מחזיר את הגלילה למצב רגיל ביציאה מהדף
    };
  }, []);
  
  // הגדרת משתנה לקבלת הודעות מהסטור
  // const message=useSelector((s)=>s.user? s.user.message:null);
  
  // //הגדרת משתנה לקבלת העיצוב מ Material UI
  // const theme = useTheme();
  
  const validateForm = (formData) => {
    const { email, password } = formData;
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'שדה חובה';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)||(!/\S+@\S+\.com$/.test(email))) {
      newErrors.email = 'כתובת מייל לא תקינה';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'שדה חובה';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'הסיסמא חייבת להכיל לפחות שישה תוים';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  //לא למחוק!!!!
  // React.useEffect(() => {
  //   if (token) {
  //     navigate('/signup'); // ניתוב לדף רישום אם המשתמש מחובר
  //   }
  // }, [token, navigate]);
// const handleSignIn = async (provider, formData) => {
//     if (validateForm(formData)) {
//       //הגדרת משתנים לקבלת פרטי המשתמש
//     const email = formData.get('email');
//     const password = formData.get('password');
//     //הכנסת המשתמש לסטור
//     setUser({ email, password});
//     //שליחת המשתמש לסטור
//     dispatch(signInServer({ email, password })) 
//     //הצגת המשתמש בקונסול
//     alert(
//       `Signing in with "${provider.name}" and credentials: ${email}, ${password}`,
//     );
//   }
// };
const handleSignIn =async (e) => {
  e.preventDefault();
  if (validateForm(formData)) {
    const { email, password } = formData;
    try {
      const resultAction = await dispatch(signInServer({ email, password })).unwrap();
      
      // שמירת הטוקן
      localStorage.setItem("token", resultAction);
      dispatch(setToken(resultAction)); // עדכון Redux
      
      // טעינת העגלה מה-cookies
      const cartItems = loadCartFromCookies(resultAction);
      
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
      // חזרה לדף שממנו הגיע
      navigate(redirectPath); 
    } catch (error) {
      console.error("Sign-in error:", error);  // הדפסת השגיאה לצורך ניתוח
      if (error.response && error.response.data === "user not found") {
        // אם השגיאה היא "משתמש לא נמצא"
        setErrors({
          email: ' ',
          password: ' ',
        });
      } else {
        setErrors({
          email: 'שגיאה בהתחברות',
          password: 'שגיאה בהתחברות',
        });
      }
    }
  }
};
//       if (error.response) {
//         if (error.response.status === 400) {
//           const errorMessage = error.response.data; // ההודעה שבאה מהשרת (לדוגמה: "user not found")
          
//           // במקרה של "user not found", נעדכן את השגיאה
//           if (errorMessage === "user not found") {
//             setErrors({
//               email: 'משתמש לא נמצא',
//               password: 'סיסמא לא נכונה',
//             });
//           } else {
//             // במידה ויש שגיאה אחרת
//             setErrors({
//               email: 'שגיאה בהתחברות',
//               password: 'שגיאה בהתחברות',
//             });
//           }
//         } else {
//           // במקרה של שגיאות אחרות
//           setErrors({
//             email: 'שגיאה בהתחברות',
//             password: 'שגיאה בהתחברות',
//           });
//         }
//       } else {
//         // אם אין תגובה מהשרת
//         setErrors({
//           email: 'שגיאה בהתחברות',
//           password: 'שגיאה בהתחברות',
//         });
//       }
//     }
//   }
// };
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
  });
};
// const BRANDING = {
//   logo: (
//     <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
//     להרשמה
//   </Link>
//   ),
// };


  return (
    // <AppProvider theme={theme} branding={BRANDING}>
    //   <SignInPage
    //     signIn={handleSignIn}
    //     providers={providers}
    //     slotProps={{
    //       emailField: { autoFocus: false, error: !!errors.email, helperText: errors.email },
    //       passwordField: { error: !!errors.password, helperText: errors.password },
    //       form: { noValidate: true },
    //     }}
    //   />
    // </AppProvider>
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, boxShadow: 3 }}>
        <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
                Sign In
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
                Welcome user, please sign in to continue
            </Typography>
            {errors.email && errors.password && (
              <Typography variant="body2" color="error" align="center" gutterBottom>
                .המייל או הסיסמא שהקשת שגויים. נסה שוב
              </Typography>
            )}
            <form onSubmit={handleSignIn} noValidate>
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                          borderColor: errors.email ? 'red' : '',  // צובעים באדום אם יש שגיאה
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                          borderColor: errors.password ? 'red' : '',  // צובעים באדום אם יש שגיאה
                        },
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                    }
                    label="Remember Me"
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 2, fontSize: "1.2rem", backgroundColor: "#1976d2" }}
                    >
                    Sign In
                </Button>
            </form>
            <Box mt={2} textAlign="center">
            <Typography variant="body2">
                משתמש חדש?{" "}
                <Link 
                    to={`/signup?redirect=${encodeURIComponent(redirectPath)}`} 
                    style={{ color: '#1976d2', textDecoration: 'none', cursor: 'pointer' }}
                >
                    לחץ כאן כדי להרשם
                </Link>
            </Typography>
            </Box>
        </CardContent>
    </Card>
  );
}
