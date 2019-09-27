import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./index.scss";

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="header-cover">
          <div className="header__menu">
            <div className="menu__item">
             <Link to="/">Home</Link>
            </div>
            <div className="menu__item">
             <Link to="/compare">Compare page</Link>
            </div>
          </div>
        </div>
      </header>)
  }
}

export default Header;
