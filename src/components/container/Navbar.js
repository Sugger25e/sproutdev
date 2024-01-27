import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/global.css';
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";


function Navbar({ accessToken }) {
  const [userName, setUserName] = useState(null);
  const [userIcon, setUserIcon] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
        const ures = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUserName(ures.data.display_name);
        setUserIcon(ures.data.images[0].url);
    };

    if (accessToken) {
      fetchUserInfo();
    }
  }, [accessToken]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div>
      <div className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="homenav">
            <img className="logo" src={logo} alt="logo" />
            <h1 className="name">Sprout</h1>
          </div>
        </Link>

        <div className="nav-right">
          <Link to="/stats">Statistics</Link>
          <Link to="/about">About</Link>
        </div>

        {accessToken && (
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div className="user-info">
              {!imageLoaded && <div>Loading...</div>}
              <img
                alt="user-icon"
                className="user-icon"
                src={userIcon}
                onLoad={handleImageLoad}
                style={{ display: imageLoaded ? "block" : "none" }}
              />
              {userName}
            </div>
          </Link>
        )}

        {!accessToken && (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
