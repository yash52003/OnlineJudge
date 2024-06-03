// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import AddProblem from './components/AddProblem';
import UserDashboard from './components/UserDashboard';
import CreateProblem from './components/CreateProblem';
import AdminDashboard from './components/AdminDashboard';
import EditProblem from './components/EditProblem';
import SolveProblem from './components/SolveProblem';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/add-problem" element={<AddProblem />} />
          <Route path="/create-problem" element={<CreateProblem />} />
          <Route path="/problems/edit/:id" element={<EditProblem />} />
          <Route path="/solve-problem/:id" element={<SolveProblem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
