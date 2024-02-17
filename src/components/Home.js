import React from 'react';
import '../styles/home.css';
import { Link } from "react-router-dom";


const Home = ({ accessToken }) => {
 
  return (
    <div>
      <div className="title-container">
      <h1 className="title">Spr<span className="htitle">o</span>ut</h1>
        <h2 className="subtitle">Your go-to place for cool Spotify tools that make music even more awesome!</h2>
        <Link to="/profile">
        <button className="gs-btn">Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
