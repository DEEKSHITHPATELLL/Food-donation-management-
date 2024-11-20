import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageHome from "./Pages/Home/PageHome";
import Register from "./Pages/AuthPages/Register";
import Login from "./Pages/AuthPages/Login";
import Dashboard from "./Pages/Dashboard.jsx/Dashboard";
import RecipeGenerator from "./Pages/Foodrecipe/FoodRecipes";
import Map from "./Pages/Maps/Map";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<PageHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/recipes" element={<RecipeGenerator/>}/>
          <Route path="/map" element={<Map/>}/>
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
