import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home.jsx";
import Ingredients from "./Ingredients.jsx"
import Nutrition from "./Nutrition.jsx";
import Notfound from "./Notfound.jsx";
import Contact from "./Contact.jsx";
import IngredientsResult from "./IngredientsResult.jsx";
import NutritionResult from "./NutritionResult.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router basename="/cook_with">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/ingredients-result" element={<IngredientsResult />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/nutrition-result" element={<NutritionResult />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);