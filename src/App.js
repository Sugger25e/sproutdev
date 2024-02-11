import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import * as Components from "./components";
import { clientId, clientSecret, redirectUri } from "./config";
import shortid from 'shortid';

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token")
  );

  const handleCallback = async (code) => {
    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        `code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const newAccessToken = tokenResponse.data.access_token;
      const newRefreshToken = tokenResponse.data.refresh_token;

      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    } catch (error) {
      console.error("Error exchanging code for token:", error.response.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const tokenResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          `refresh_token=${refreshToken}&grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const newAccessToken = tokenResponse.data.access_token;

        localStorage.setItem("access_token", newAccessToken);

        setAccessToken(newAccessToken);
      } catch (error) {
        console.error("Error refreshing access token:", error.response.data);
      }
    };

    if (refreshToken) {
        refreshAccessToken();
    }
  }, [refreshToken]);

  useEffect(() => {
    let uid = localStorage.getItem('uid')
    if(!uid) {
      uid = shortid.generate()
      localStorage.setItem('uid', uid)
    }
}, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Components.Main accessToken={accessToken} />}
        />
        <Route
          path="/home"
          element={<Components.Home accessToken={accessToken} />}
        />
        <Route
          path="/stats"
          element={
            <Components.Stats accessToken={accessToken} />
          }
        />
        <Route
          path="/profile"
          element={<Components.Profile accessToken={accessToken} />}
        />
        <Route path="/about" element={<Components.About />} />
        <Route path="/downloader" element={<Components.Downloader />} />
        <Route path="/downloader/download" element={<Components.Download />} />
        <Route
          path="/callback"
          element={<Components.Callback handleCallback={handleCallback} />}
        />
        <Route path="/login" element={<Components.Login />} />
        <Route path="/logout" element={<Components.Logout handleLogout={handleLogout} />} />
        <Route path="*" element={<Components.NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;