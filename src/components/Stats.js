import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/home.css";
import Navbar from "./container/Navbar";

const Stats = ({ accessToken }) => {
  const [timeRanges] = useState(['short_term', 'medium_term', 'long_term']);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRanges[selectedTimeIndex]}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const topTracks = response.data.items;
        setTracks(topTracks);

        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching top tracks:', error.response.data);
        setLoading(false);
      }
    };

    const fetchTopArtists = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRanges[selectedTimeIndex]}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const topArtists = response.data.items;
        setArtists(topArtists);
      } catch (error) {
        console.error('Error fetching top artists:', error.response.data);
      }
    };

    fetchTopTracks();
    fetchTopArtists();
  }, [selectedTimeIndex, accessToken, timeRanges]);

  useEffect(() => {
    // After loading, add the 'loaded' class to trigger the transition
    if (!loading) {
      const cards = document.querySelectorAll('.stats-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('loaded');
        }, index * 100); // Adjust the delay as needed
      });
    }
  }, [loading]);

  const handleTimeRangeChange = (index) => {
    setSelectedTimeIndex(index);
    setLoading(true);
  };

  return (
    <div className="track-container">
      <Navbar accessToken={accessToken} />

      <h2>Top Tracks</h2>

      <div className="time-navigation">
        <button
          className={`time-button ${selectedTimeIndex === 0 ? 'selected' : ''}`}
          onClick={() => handleTimeRangeChange(0)}
        >
          Last Month
        </button>
        <button
          className={`time-button ${selectedTimeIndex === 1 ? 'selected' : ''}`}
          onClick={() => handleTimeRangeChange(1)}
        >
          Last 6 Months
        </button>
        <button
          className={`time-button ${selectedTimeIndex === 2 ? 'selected' : ''}`}
          onClick={() => handleTimeRangeChange(2)}
        >
          All Time
        </button>
      </div>

      <div className="stats-card-container">
        {loading ? (
          // Loading state: Display gray loading cards
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="stats-card loading-card">
              <div className="stats-card-img loading-card-img"></div>
              <div className="stats-card-content-img loading-card-content-img"></div>
              <div className="stats-card-content-text loading-card-content-text">
                <div className="loading-card-text"></div>
                <div className="loading-card-text"></div>
              </div>
              <span className="stats-card-content-num loading-card-content-num"></span>
            </div>
          ))
        ) : (
          // Loaded state: Display actual music cards
          <>
            <div className="left-section">
              {tracks.slice(0, 5).map((track, index) => (
                <div key={index} className="stats-card">
                  <div className="stats-card-img" style={{ backgroundImage: `url(${track.album.images[0].url})` }}></div>
                  <div className="stats-card-content-img" style={{ backgroundImage: `url(${track.album.images[0].url})` }}></div>
                  <div className="stats-card-content-text">
                    <h2>{track.name}</h2>
                    <h3>{track.artists.map((u) => u.name).join(", ")}</h3>
                  </div>
                  <span className="stats-card-content-num">{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="right-section">
              {tracks.slice(5, 10).map((track, index) => (
                <div key={index + 5} className="stats-card">
                  <div className="stats-card-img" style={{ backgroundImage: `url(${track.album.images[0].url})` }}></div>
                  <div className="stats-card-content-img" style={{ backgroundImage: `url(${track.album.images[0].url})` }}></div>
                  <div className="stats-card-content-text">
                    <h2>{track.name}</h2>
                    <h3>{track.artists.map((u) => u.name).join(", ")}</h3>
                  </div>
                  <span className="stats-card-content-num">{index + 6}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <h2>Top Artists</h2>

      <div className="stats-card-container">
        {loading ? (
          // Loading state: Display gray loading cards
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="stats-card loading-card">
              <div className="stats-card-img loading-card-img"></div>
              <div className="stats-card-content-img loading-card-content-img"></div>
              <div className="stats-card-content-text loading-card-content-text">
                <div className="loading-card-text"></div>
                <div className="loading-card-text"></div>
              </div>
              <span className="stats-card-content-num loading-card-content-num"></span>
            </div>
          ))
        ) : (
          // Loaded state: Display actual artist cards
          <>
            <div className="left-section">
              {artists.slice(0, 5).map((artist, index) => (
                <div key={index} className="stats-card">
                  <div className="stats-card-img" style={{ backgroundImage: `url(${artist.images[0].url})` }}></div>
                  <div className="stats-card-content-img" style={{ backgroundImage: `url(${artist.images[0].url})` }}></div>
                  <div className="stats-card-content-text">
                    <h2>{artist.name}</h2>
                    <h3>{artist.genres.map((s) => s[0].toUpperCase() + s.slice(1)).join(", ")}</h3>
                  </div>
                  <span className="stats-card-content-num">{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="right-section">
              {artists.slice(5, 10).map((artist, index) => (
                <div key={index + 5} className="stats-card">
                  <div className="stats-card-img" style={{ backgroundImage: `url(${artist.images[0].url})` }}></div>
                  <div className="stats-card-content-img" style={{ backgroundImage: `url(${artist.images[0].url})` }}></div>
                  <div className="stats-card-content-text">
                    <h2>{artist.name}</h2>
                    <h3>{artist.genres.map((s) => s[0].toUpperCase() + s.slice(1)).join(", ")}</h3>
                  </div>
                  <span className="stats-card-content-num">{index + 6}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;
