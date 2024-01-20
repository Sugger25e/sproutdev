import React from 'react';
import '../styles/home.css';
import Navbar from "./container/Navbar";

const Home = ({ accessToken }) => {
  return (
    <div>
      <Navbar accessToken={accessToken} />
    </div>
  );
};

export default Home;
