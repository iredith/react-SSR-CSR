import React, { Fragment } from "react";
import { Route, Routes, Link } from "react-router-dom";
import AboutPage from "../pages/About";
import ContactPage from "../pages/Contact";
import HomePage from "../pages/Home";

const App = ({ type }) => {
  return (
    <Fragment>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage type={type} />} />
        <Route path="/about" element={<AboutPage type={type} />} />
        <Route path="/contact" element={<ContactPage type={type} />} />
      </Routes>
    </Fragment>
  );
};

App.defaultProps = {
  type: "CSR",
};

export default App;
