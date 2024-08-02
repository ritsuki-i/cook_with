import React, { useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css'


function Header({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = ["/", "/nutrition", "/ingredients", "/contact"];
  const ItemNames = ["ホーム", "欲しい栄養素で検索", "使いたい食材で検索", "お問い合わせ"];

  const navToggleRef = useRef(null);
  const navRef = useRef(null);
  const overlayRef = useRef(null);

  const ShowHambuegermenu = () => {
    if (navToggleRef.current && navRef.current && overlayRef.current) {
      const navClasses = navRef.current.classList;
      const navToggleClasses = navToggleRef.current.classList;
      const overlayClasses = overlayRef.current.classList;
  
      if (navClasses.contains("show")) {
        navClasses.remove("show");
        navClasses.add("hide");
        navToggleClasses.remove("show");
        navToggleClasses.add("hide");
        overlayClasses.remove("show");
        document.body.style.overflow = "auto";
      } else {
        navClasses.remove("hide");
        navClasses.add("show");
        navToggleClasses.remove("hide");
        navToggleClasses.add("show");
        overlayClasses.add("show");
        document.body.style.overflow = "hidden";
      }
    }
  };

  const handleNavClick = (item) => {
    navigate(item);
    ShowHambuegermenu();
  };


  const LoadMenu = () => {
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
      <div className="overlay" ref={overlayRef}></div>
      <div className="hamburger-menu">
        <span className="nav_toggle" ref={navToggleRef} onClick={ShowHambuegermenu}>
          <i></i>
          <i></i>
          <i></i>
        </span>
        <nav className="nav" ref={navRef}>
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
