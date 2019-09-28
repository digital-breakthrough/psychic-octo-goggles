import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./index.scss";

class Header extends Component {
  
  onStartAgain() {
    window.location.href ="/";
  }

  render() {
    return (
      <header className="header">
        <div className="header-cover">
          <div className="header__logo">
            <div onClick={e => this.onStartAgain()}>
              <img src="/logo.png" alt="logo" />
            </div>
          </div>
          <div className="header__menu">
            <div className="menu__item">
             <Link to="/about">О сервисе</Link>
            </div>
            <div className="menu__item">
             <Link to="/about">Контакты</Link>
            </div>
          </div>
          <div className="header__profile">
            <img src="/profile.png" alt="profile" />
          </div>
        </div>
      </header>)
  }
}

export default Header;
