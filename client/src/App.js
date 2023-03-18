
import './App.css';
import Navbar from './pages/Navbar';
import { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes } from "react-router-dom";


function App() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:3000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          console.log("got object", resObject);
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);


  return (
    <Router>
      <Navbar user={user}/>
    </Router>
  );
}

export default App;
