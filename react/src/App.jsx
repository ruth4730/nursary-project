import { useState,useEffect } from 'react'
import './App.css'
import Login from './Components/features/User/Login'
import ShowAllPlants from './Components/features/Plant/ShowAllPlants'
import { BrowserRouter as Router,Routes,Route ,Link} from 'react-router-dom'
import PlantDetail from './Components/PlantDetail'
import PlantCard from './Components/features/Plant/PlantCard.jsx'
import {store} from './Components/app/store'
import { Provider } from 'react-redux'
import Cart from './Components/features/Cart/Cart.jsx'
import Navbar from './Components/Navbar/Navbar';
import Order from './Components/features/Order/Order.jsx'
import SignUp from './Components/features/User/SingnUp.jsx'
import { setToken } from "./Components/features/User/UserSlice.jsx"; // פעולה שמעדכנת את הסטור
import { useDispatch } from "react-redux";

function App() {
  const [showLogin, setShowLogin] = useState(true)
  const handleSubmit = (isValid) => {
  if (isValid) {
    setShowLogin(true);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token)); // עדכון Redux עם הטוקן שנשמר
    }
  }, [dispatch]);
};

  return (
    <>
      <Provider store={store}>
        <Router>
          <Navbar/>
            <Routes>
              <Route path="/" element={<ShowAllPlants />} />
              <Route path="/plant/:id" element={<PlantCard/>} /> 
              <Route path='/cart' element={<Cart/>}/>
              <Route path='/order' element={<Order/>}></Route>
              <Route path='/login' element={<Login/>}></Route>
              <Route path='/signup' element={<SignUp/>}></Route>
            </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App

{/*<Router>
        <Routes>
          <Route path="/" element={<ShowAllPlants />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
        </Routes>
      </Router>
      {/*{!showLogin ? <Login onSubmit={handleSubmit} /> : <ShowAllPlants />}
      
      {!showLogin ? (
            <Login onSubmit={handleSubmit} />
          ) : (
}}
      */}