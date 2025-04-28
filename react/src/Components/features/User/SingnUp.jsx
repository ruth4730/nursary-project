import  React from 'react';
import { useState,useEffect } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { login, register, signInServer ,GetAllUsers} from './UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import ShowAllPlants from '../Plant/ShowAllPlants';
import { useNavigate,useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, Checkbox, FormControlLabel,Box } from '@mui/material';
import { initializeCart } from "../CartCookiesSlice";

const SignUp=()=>{
    const location = useLocation();
    const[flag,setFlag]=useState(false)
    const dispatch=useDispatch();
    const allUsers = useSelector((state) => state.user.allUsers); // שליפת המשתמשים מהסטייט
    const navigate=useNavigate();

    // קריאת הפרמטר redirect מה-URL
    const params = new URLSearchParams(location.search);
    const [redirectPath] = useState(params.get("redirect") || "/");  // הוספת useState כדי לשמור על הערך
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'auto'; // מחזיר את הגלילה למצב רגיל ביציאה מהדף
        };
      }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({ email: '', password: '' });
    const [emailExists, setEmailExists] = useState(false); 
  
    useEffect(() => {
        dispatch(GetAllUsers()); // שליפת כל המשתמשים מהשרת רק פעם אחת
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validateForm = async(formData) => {
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
        else {
            // בדיקה אם המייל כבר קיים במערכת
            const exists = allUsers.some((user) => user.email === email);
            setEmailExists(exists);
            if (exists) {
                newErrors.email = 'כתובת המייל שהוקשה תפוסה, נסה שוב';
                valid = false;
            }
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

    //פונקציה לקבלת פרטי המשתמש והכנסתם לסטור
    const handleSubmit = async (e) => {
        e.preventDefault(); // לעצור את שליחת הטופס כברירת מחדל
    
        if (await validateForm(formData)) {
            try {
                const response = await dispatch(register({ 
                email: formData.email, 
                password: formData.password, 
            })).unwrap(); // unwrap שולף את התוצאה כדי לבדוק אותה
            
            localStorage.setItem("token",response.token)
                
            // איפוס העגלה עבור משתמש חדש
            dispatch(initializeCart({ 
                cartItems: {}, 
                totalQuantity: 0, 
                totalAmount: 0 
            }));
            setFlag(true);
            navigate(redirectPath); // ניווט רק לאחר הרשמה מוצלחת
            } catch (error) {
                console.error("Registration failed:", error);
                if (error.response) {
                    // אם יש תגובה מהשרת
                    console.error("Error response:", error.response);
                    alert(`Registration failed: ${error.response.data}`);
                } else {
                    alert("Registration failed. Please try again.");
                }
            }
        }
    };
   
    return(
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, boxShadow: 3 }}>
        <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
                Sign Up
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
                Welcome user, please sign up to continue
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
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
                            borderColor: errors.email ? 'red' : '',
                        },
                    }}
                />
                {emailExists && (
                    <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
                    </Typography>
                )}
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
                            borderColor: errors.password ? 'red' : '',
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
                    Sign Up
                </Button>
            </form>
            <Box mt={2} textAlign="center">
            <Typography variant="body2">
                משתמש רשום?{" "}
                <Link 
                    to={`/login?redirect=${encodeURIComponent(redirectPath)}`} 
                    style={{ color: '#1976d2', textDecoration: 'none', cursor: 'pointer' }}
                >
                    לחץ כאן כדי להתחבר
                </Link>
            </Typography>
            </Box>
        </CardContent>
    </Card>
    );
};
export default SignUp;