import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/downloader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

async function SearchQuery({ query, accessToken }) {
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query.toLowerCase())}&type=track&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setSearchResult(response.data.tracks.items);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchQuery();
  }, [query, accessToken]);

  const handleImageContextMenu = (e) => {
    e.preventDefault(); 
  };

  return (
    <div>
      <div className="dl-card-container">
        {searchResult.map((track, index) => (
          <div key={index} className="dl-card">
            <img
              className="dl-card-img"
              alt={track.name}
              src={track.album.images[0].url}
              onContextMenu={handleImageContextMenu}
              draggable={false}
            />
            <img
              className="dl-card-content-img"
              alt={track.name}
              src={track.album.images[0].url}
              onContextMenu={handleImageContextMenu}
              draggable={false}
            />
            <div className="dl-card-content-text">
              <h2>{track.name}</h2>
              <h3>by {track.artists.map((u) => u.name).join(', ')}</h3>
            </div>

            <Link to={`/downloader/download?id=${track.id}`}>
            <div className='dl-button'>
              <FontAwesomeIcon icon={faDownload} />
            </div>
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchQuery;
