import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css'


function Header({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = ["/", "/nutrition", "/ingredients", "/contact"];
  const ItemNames = ["ホーム", "欲しい栄養素で検索", "使いたい食材で検索", "お問い合わせ"];

  const ShowHambuegermenu = () => {
    const Hambuegermenu = document.querySelector(".nav_toggle");
    const HambuegermenuElement = document.querySelector(".nav");
    const overlay = document.querySelector(".overlay");

    Hambuegermenu.classList.toggle("show");
    HambuegermenuElement.classList.toggle("show");
    overlay.classList.toggle("show");

    if (overlay.classList.contains("show")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleNavClick = (item) => {
    navigate(item);
    ShowHambuegermenu();
  };


  const LoadMenu = () =>{
    const navigation = navItems.map((item, index) => (
      <li
        key={index}
        className={`menu_li ${location.pathname === item ? "menu_active" : ""}`}
        onClick={() => navigate(item)}
      >
        {ItemNames[index]}
      </li>
    ));
    return navigation;
  }

  const LoadnavMenu = () => {
    const navigation = navItems.map((item, index) => (
      <li
        key={index}
        className={`nav_menu_li ${location.pathname === item ? "nav_active" : ""}`}
        onClick={() => handleNavClick(item)}
      >
        {ItemNames[index]}
      </li>
    ));
    return navigation;
  };

  return (
    <div className="Header">
      <div className="overlay"></div>
      <div className="hamburger-menu">
        <span className="nav_toggle" onClick={ShowHambuegermenu}>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <nav className="nav">
          <ul className="nav_menu_ul">{LoadnavMenu()}</ul>
        </nav>
      </div>
      <div className={"header-menu " + className}>
        <ul className="menu_ul">{LoadMenu()}</ul>
      </div>
    </div>
  );
}

export default Header;
