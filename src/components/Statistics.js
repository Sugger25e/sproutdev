import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/stats.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./container/Sidebar";

const Stats = ({ accessToken }) => {
  const [timeRanges] = useState(["short_term", "medium_term", "long_term"]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

    useEffect(() => {
      if(!accessToken) {
        return navigate('/login')
      }

    const fetchTopTracks = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRanges[selectedTimeIndex]}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const topTracks = response.data.items;
        setTracks(topTracks);

        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching top tracks:", error.response.data);
        setLoading(false);
      }
    };

    const fetchTopArtists = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRanges[selectedTimeIndex]}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const topArtists = response.data.items;
        setArtists(topArtists);
      } catch (error) {
        console.error("Error fetching top artists:", error.response.data);
      }
    };

    fetchTopTracks();
    fetchTopArtists();
  }, [selectedTimeIndex, accessToken, timeRanges, navigate]);



  useEffect(() => {

    if (!loading) {
      const cards = document.querySelectorAll(".stats-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("loaded");
        }, index * 100); 
      });
    }
  }, [loading]);

  const handleTimeRangeChange = (index) => {
    setSelectedTimeIndex(index);
    setLoading(true);
  };

  return (
    <div className="app-container">
      <Sidebar accessToken={accessToken} />
    <div className="main-content">
      <div className="stats-navigation">
      </div>

      <div className="top-container">
      <h2 className="top-title">Top Tracks</h2>
      <div className="time-navigation">
  <button
    className={`time-button ${selectedTimeIndex === 0 ? "selected" : ""}`}
    onClick={() => handleTimeRangeChange(0)}
    disabled={selectedTimeIndex === 0} 
  >
    Last Month
  </button>
  <button
    className={`time-button ${selectedTimeIndex === 1 ? "selected" : ""}`}
    onClick={() => handleTimeRangeChange(1)}
    disabled={selectedTimeIndex === 1} 
  >
    Last 6 Months
  </button>
  <button
    className={`time-button ${selectedTimeIndex === 2 ? "selected" : ""}`}
    onClick={() => handleTimeRangeChange(2)}
    disabled={selectedTimeIndex === 2} 
  >
    All Time
  </button>
</div>
      <div className="stats-card-container">
            <div className="left-section">
              {tracks.slice(0, 5).map((track, index) => (
                <div key={index} className="stats-card">
                  <img
                    className="stats-card-img"
                    alt={track.name}
                    src={track.album.images[0].url}
                  />
                  <img
                    className="stats-card-content-img"
                    alt={track.name}
                    src={track.album.images[0].url}
                  />
                  <div className="stats-card-content-text">
                    <p className='stats-card-title'>{track.name}</p>
                    <p className='stats-card-artist'>{track.artists.map((u) => u.name).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="right-section">
              {tracks.slice(5, 10).map((track, index) => (
              <div key={index + 5} className="stats-card">
              <img
                className="stats-card-img"
                alt={track.name}
                src={track.album.images[0].url}
              />
              <img
                className="stats-card-content-img"
                alt={track.name}
                src={track.album.images[0].url}
              />
              <div className="stats-card-content-text">
                <p className='stats-card-title'>{track.name}</p>
                <p className='stats-card-artist'>{track.artists.map((u) => u.name).join(", ")}</p>
              </div>
            </div>
              ))}
            </div>
      </div>
</div>

<div className="top-container">
      <h2 className="top-title">Top Artists</h2>

      <div className="stats-card-container">
            <div className="left-section">
              {artists.slice(0, 5).map((artist, index) => (
                <div key={index} className="stats-card">
                  <img
                    className="stats-card-img"
                    alt={artist.name}
                    src={artist.images[0].url}
                  />
                  <img
                    className="stats-card-content-img"
                    alt={artist.name}
                    src={artist.images[0].url}
                  />
                  <div className="stats-card-content-text">
                    <h2>{artist.name}</h2>
                    <h3>
                      {artist.genres
                        .map((s) => {
                          return s[0].toUpperCase() + s.slice(1);
                        })
                        .join(", ")}
                    </h3>
                  </div>
                  <span className="stats-card-content-num">{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="right-section">
              {artists.slice(5, 10).map((artist, index) => (
                <div key={index + 5} className="stats-card">
                  <img
                    className="stats-card-img"
                    alt={artist.name}
                    src={artist.images[0].url}
                  />
                  <img
                    className="stats-card-content-img"
                    alt={artist.name}
                    src={artist.images[0].url}
                  />
                  <div className="stats-card-content-text">
                    <h2>{artist.name}</h2>
                    <h3>
                      {artist.genres
                        .map((s) => {
                          return s[0].toUpperCase() + s.slice(1);
                        })
                        .join(", ")}
                    </h3>
                  </div>
                  <span className="stats-card-content-num">{index + 6}</span>
                </div>
              ))}
            </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Stats;
