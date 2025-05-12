import React from 'react'
import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom";
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/SignUp';
import Home from './Pages/Dashboard/Home';
import Income from './Pages/Dashboard/Income';
import Expense from './Pages/Dashboard/Expense';
import EditProfile from './Pages/Dashboard/EditProfile';
import ChatBot from './Pages/Dashboard/ChatBot';
import UserProvider from './Context/UserContext';
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root></Root>}/>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
          <Route path='/dashboard' element={<Home/>}></Route>
          <Route path='/income' element={<Income/>}></Route>
          <Route path='/expense' element={<Expense/>}></Route>
          <Route path='/edit' element={<EditProfile/>}></Route>
          <Route path='/chatbot' element={<ChatBot/>}></Route>
        </Routes>
      </Router>
    </div>  
    <Toaster
      toastOptions={{
      className: "",
      style: {
      fontSize: "13px",
        },
      }}
    />
    </UserProvider>
  )
}

export default App

const Root=()=>{
  //Check If Token Exist In Locale Storage
  const Authenticated=!!localStorage.getItem("token");
  return Authenticated ? (<Navigate to={"/dashboard"}></Navigate>):(<Navigate to={"/login"}></Navigate>)
  }