// Header.js
import React from 'react';
import SearchTerm from './SearchTerm';
import './Header.css';

const Header = () => {
  const handleLogoClick = () => {
    alert('Логотип нажат!');
  };

  return (
    <div className="header">
      <img
        src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
        alt="Logo"
        className="logo"
        onClick={handleLogoClick}
      />
      <SearchTerm />
    </div>
  );
};

export default Header;