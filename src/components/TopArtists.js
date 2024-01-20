import React from 'react';
import { Link } from 'react-router-dom';

const TopArtists = ({ accessToken, topArtists }) => {

  return (
    <div>
      <h1>Top Artists</h1>
      {accessToken ? (
        <div>
          <p>Your top artists are: {topArtists}</p>
        </div>
      ) : (
        <div>
          No access token found. Please log in.
        </div>
      )}

      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
};

export default TopArtists;
