import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import "./index.css"
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage'
import React from "react"
import Dashboard from './components/Dashboard';
import AddProblem from './components/AddProblem';
import { useState, useEffect } from "react";
import instance from '../src/components/api';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Homepage />} />
        <Route path = "/login" element={<Login />}/>
        <Route path = "/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/add-problem" element={<AddProblem />} />
      </Routes>
    </Router>
  );
}

export default App;
