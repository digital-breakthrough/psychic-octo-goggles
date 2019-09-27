import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header/index";

import Home from "./pages/Home/index";
import Compare from "./pages/Compare/index"

import './App.scss';
import 'antd/dist/antd.css';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={Home} />
        <Route path="/compare" component={Compare} />
      </div>
    </Router>
  );
}

export default App;
