import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import * as Components from "./components";

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const ures = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUserName(ures.data.display_name);

        /* const ares = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=long_term', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const topGenres = ares.data.items
          .flatMap((artist) => artist.genres)
          .reduce((genres, genre) => {
            genres[genre] = (genres[genre] || 0) + 1;
            return genres;
          }, {});

        const sortedGenres = Object.keys(topGenres).sort((a, b) => topGenres[b] - topGenres[a]);

        function capitalizeWords(inputString) {
          return inputString.replace(/\b\w/g, function(match) {
              return match.toUpperCase();
          });
      }

        const top5Genres = sortedGenres.map((g) => capitalizeWords(g)).slice(0, 5);*/
      } catch (error) {
        console.error("Error fetching user information:", error.response.data);
        if (error.response.status === 401) {
          localStorage.removeItem("access_token");
          setAccessToken(null);
          document.cookie =
            "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    };

    if (accessToken) {
      fetchUserInfo();
    }
  }, [accessToken]);

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
            <Components.Stats accessToken={accessToken} userName={userName} />
          }
        />
        <Route
          path="/profile"
          element={<Components.Profile accessToken={accessToken} />}
        />
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