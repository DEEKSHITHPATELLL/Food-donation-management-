import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageHome from "./Pages/Home/PageHome";
import Login from "./Pages/AuthPages/Login";
import Register from "./Pages/AuthPages/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import UserDashboard from "./Pages/Dashboard/UserDashboard";
import RecipeGenerator from "./Pages/Foodrecipe/FoodRecipes";
import Help from "./Pages/Helps/Help";
import Map from "./Pages/maps/Map";
import Donate from "./Pages/Donate/Donate";
import { DonationProvider } from './context/DonationContext';

function App() {
  return (
    <React.StrictMode>
      <DonationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PageHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/recipes" element={<RecipeGenerator />} />
            <Route path="/map" element={<Map />} />
            <Route path="/help" element={<Help />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </Router>
      </DonationProvider>
    </React.StrictMode>
  );
}

export default App;
