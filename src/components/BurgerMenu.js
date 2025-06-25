// src/components/BurgerMenu.js
import React from 'react';
import './BurgerMenu.css';

const BurgerMenu = ({ toggleMenu }) => {
  return (
    <button
      className="hamburger"
      onClick={toggleMenu}
      aria-label="Toggle menu"
    >
      ☰
    </button>
  );
};

export default BurgerMenu;
