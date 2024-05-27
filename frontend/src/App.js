import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import "./index.css"
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage'
import React from "react"
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Homepage />} />
        <Route path = "/login" element={<Login />}/>
        <Route path = "/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
