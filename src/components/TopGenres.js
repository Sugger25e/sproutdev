import React from 'react';
import { Link } from 'react-router-dom';

const TopGenres = ({ accessToken, topGenres }) => {

  return (
    <div>
      <h1>Top Genres</h1>
      {accessToken ? (
        <div>
          <p>Your top genres are: {topGenres}</p>
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

export default TopGenres;
