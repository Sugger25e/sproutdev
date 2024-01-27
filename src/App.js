import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import * as Components from "./components";
import { clientId, clientSecret, redirectUri } from "./config";

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
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

      localStorage.setItem("access_token", newAccessToken);

      setAccessToken(newAccessToken);
    } catch (error) {
      console.error("Error exchanging code for token:", error.response.data);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
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
        <Route
          path="/callback"
          element={<Components.Callback handleCallback={handleCallback} />}
        />
        <Route path="/login" element={<Components.Login />} />
        <Route path="*" element={<Components.NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;