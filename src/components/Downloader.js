import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/downloader.css';
import { Link } from 'react-router-dom';
import { authenticate } from './container/getTrack.js';

function Downloader() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!loading) {
      const cards = document.querySelectorAll(".dl-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("loaded");
        }, index * 100); 
      });
    }
  }, [loading]);

  const apiCall = async () => {
    setLoading(true);
    try {
      const accessToken = await authenticate();

      if (query && accessToken) {
            const sres = await axios.get(
              `https://api.spotify.com/v1/search?q=${encodeURIComponent(query.toLowerCase())}&type=track&limit=10`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setSearchResult(sres.data.tracks.items);
          }
    } catch (error) {
      console.error('Error fetching access token:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="search-box">
        <div className="search-input-container">
          <input
            className="search-input"
            onChange={(q) => setQuery(q.target.value)}
            placeholder="Search for a track..."
          />
          <button className="search-icon" onClick={apiCall}>
            Search
          </button>
        </div>
      </div>
      <div className='dl-card-container'>
      {loading ? (    
       <>
       {[...Array(5)].map((_, index) => (
         <div className="dl-left-section" key={`left-card-${index}`}>
           <div className="stats-load-card">
             <div className="stats-load-card-content-img"></div>
             <div className="stats-load-card-content-text">
               <div className="stats-load-title"></div>
               <div className="stats-load-subtitle"></div>
             </div>
           </div>
         </div>
       ))}
     
       {[...Array(5)].map((_, index) => (
         <div className="dl-right-section" key={`right-card-${index}`}>
           <div className="stats-load-card">
             <div className="stats-load-card-content-img"></div>
             <div className="stats-load-card-content-text">
               <div className="stats-load-title"></div>
               <div className="stats-load-subtitle"></div>
             </div>
           </div>
         </div>
       ))}
     </>
      ) : ( 
        <>
        <div className='dl-left-section'>
        {searchResult.slice(0, 5).map((track, index) => (
                <div key={index} className="dl-card">
                  <img
                    className="dl-card-img"
                    alt={track.name}
                    src={track.album.images[0].url}
                  />
                  <img
                    className="dl-card-content-img"
                    alt={track.name}
                    src={track.album.images[0].url}
                  />
                  <div className="dl-card-content-text">
                    <h2>{track.name}</h2>
                    <h3>{track.artists.map((u) => u.name).join(", ")}</h3>
                    <Link to={`/downloader/download?id=${track.id}`}>
                  <div className='dl-btn'>
                    Download
                  </div>
                  </Link>
                  </div>
                </div>
              ))}
        </div>
        <div className='dl-right-section'>
        {searchResult.slice(5, 10).map((track, index) => (
                <div key={index + 5} className="dl-card">
                  <img
                    className="dl-card-img"
                    alt={track.name}
                    src={track.album.images[0].url}
                  />
                  <img
                    className="dl-card-content-img"
                    alt={track.name}
                    src={track.album.images[0].url}
                  />
                  <div className="dl-card-content-text">
                    <h2>{track.name}</h2>
                    <h3>{track.artists.map((u) => u.name).join(", ")}</h3>
                    <Link to={`/download?id=${track.id}`}>
                  <div className='dl-btn'>
                    Download
                  </div>
                  </Link>
                  </div>
                </div>
              ))}
        </div>
     </>
        )}
        </div>

    </div>
  );
}

export default Downloader;
