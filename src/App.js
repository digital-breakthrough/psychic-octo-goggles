import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header/index";

import AboutUs from "./pages/AboutUs/index";
import Home from "./pages/Home/index"

import './App.scss';
import 'antd/dist/antd.css';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={Home} />
        <Route path="/about" component={AboutUs} />
      </div>
    </Router>
  );
}

export default App;
