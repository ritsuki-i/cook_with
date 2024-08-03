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
import PreloadImages from './PreloadImages';

const root = ReactDOM.createRoot(document.getElementById("root"));

const imagesToPreload = [
  `${process.env.PUBLIC_URL}/img/COOK_WITH_transparent_white.png`,
  `${process.env.PUBLIC_URL}/img/COOK_WITH_transparent_black.png`,
  `url(${process.env.PUBLIC_URL}/img/ingradient_title_smartphone_img.png)`,
  `${process.env.PUBLIC_URL}/img/ingradient_title_img.png`,
  `url(${process.env.PUBLIC_URL}/img/nutrition_title_smartphone_img.png)`,
  `${process.env.PUBLIC_URL}/img/nutrition_title_img.png`,
  `${process.env.PUBLIC_URL}/img/ex1.jpg`,
  `${process.env.PUBLIC_URL}/img/ex2.jpg`,
  `${process.env.PUBLIC_URL}/img/ex3.jpg`,
  `${process.env.PUBLIC_URL}/img/ex4.jpg`
];

root.render(
  <React.StrictMode>
    <PreloadImages imageUrls={imagesToPreload} />
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