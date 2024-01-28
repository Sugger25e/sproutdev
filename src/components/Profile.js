import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Navbar from "./container/Navbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

const spotifyBg = ["#4b917d", "#f037a5", "#fa6700", "#1db954", "#7331a6"];

function Profile({ accessToken }) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    image: "",
    email: "",
    following: 0,
    followers: 0,
    url: "",
  });

  const [topGenres, setTopGenres] = useState([]);
  const [genreImages, setGenreImages] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      return navigate("/login");
    }

    const fetchUser = async () => {
      try {
        const userResponse = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { display_name, images, email, followers, external_urls } =
          userResponse.data;

        const followingResponse = await axios.get(
          "https://api.spotify.com/v1/me/following?type=artist&limit=50",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const followingCount = followingResponse.data.artists.total;

        setUserInfo({
          name: display_name,
          image: images.length > 0 ? images[0].url : "",
          email: email,
          following: followingCount,
          followers: followers.total,
          url: external_urls.spotify,
        });

        const topArtistsResponse = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const genres = topArtistsResponse.data.items.reduce(
          (allGenres, artist) => {
            allGenres.push(...artist.genres);
            return allGenres;
          },
          []
        );

        const genreCount = genres.reduce((count, genre) => {
          count[genre] = (count[genre] || 0) + 1;
          return count;
        }, {});

        const totalGenres = genres.length;
        const genrePercentages = Object.keys(genreCount).map((genre) => {
          return {
            genre: genre,
            percentage:
              ((genreCount[genre] / totalGenres) * 100).toFixed(1) * 10,
          };
        });

        const topGenres = genrePercentages
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5);

        setTopGenres(topGenres);

        const genreImagesPromises = topGenres.map(async (genre) => {
          const response = await axios.get(
            `https://api.spotify.com/v1/search`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              params: {
                q: `genre:"${genre.genre}"`,
                type: "artist",
                limit: 3,
              },
            }
          );

          const artists = response.data.artists.items;
          const images = artists.map((artist) =>
            artist.images.length > 0 ? artist.images[0].url : ""
          );
          const artistNames = artists.map((artist) => artist.name);
          return { genre: genre.genre, images, artistNames };
        });

        const genreImagesData = await Promise.all(genreImagesPromises);
        const genreImagesObj = genreImagesData.reduce(
          (obj, { genre, images, artistNames }) => {
            obj[genre] = { images, artistNames };
            return obj;
          },
          {}
        );

        setGenreImages(genreImagesObj);
        setTimeout(() => {
          setIsLoaded(true);
        }, 500)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [accessToken, navigate]);

  return (
    <div>
      <Navbar accessToken={accessToken} />
      { isLoaded ? (
        <>
              <div className="info-card">
              <img
                className="info-card-img"
                alt={userInfo.name}
                src={userInfo.image}
              />
              <img
                className="info-card-content-img"
                alt={userInfo.name}
                src={userInfo.image}
              />
              <div className="info-card-content-text">
                <h2>
                  {userInfo.name} <span className="email">({userInfo.email})</span>
                </h2>
                <h3>
                  {userInfo.following} Following &#x2022; {userInfo.followers}{" "}
                  Followers
                </h3>
              </div>
      
              <Link to={userInfo.url} target="_blank" rel="noopener noreferrer">
                <button className="profile-btn">Profile Link</button>
              </Link>
            </div>
            </>
      ) : (
      <>
        <div className="info-load-card">
        <div
          className="info-load-card-content-img"></div>
  
        <div className="info-load-card-content-text">
        <div className="stats-load-title"></div>
        <div className="stats-load-subtitle"></div>
        </div>
      </div>
      </>
      )
    }

<div class="pf-card-container">
        <div className="genre-card">
          <h4 className="card-title">Top Genres</h4>

          <div className="genre-container">
            <div className="genre-name-container">
              {topGenres.map((genre, index) => (
                <p className="genre-name">
                  {genre.genre.charAt(0).toUpperCase() + genre.genre.slice(1)}
                </p>
              ))}
            </div>
            <div className="vertical-line"></div>
            <div className="genre-bar-container">
              {topGenres.map((genre, index) => (
                <div className="genre-bar-wrapper" key={index}>
                  <div
                    className="genre-bar"
                    style={{
                      width: `${isLoaded ? genre.percentage / 4 + 5 : 1}pc`,
                      backgroundColor: `${spotifyBg[index]}`,
                    }}
                  >
                    <span className={"genre-percent"} style={{opacity: `${isLoaded ? 1 : 0}`}}>{genre.percentage}%</span>
                  </div>
                  <div className="artist-images-container" style={{opacity: `${isLoaded ? 1 : 0}`}}>
                    {genreImages[genre.genre] &&
                      genreImages[genre.genre].images.map((image, i) => (
                        <Tooltip
                          key={i}
                          title={genreImages[genre.genre].artistNames[i]}
                          position="top"
                          trigger="mouseenter"
                          animation="fade"
                          arrow="true"
                        >
                          <img
                            key={i}
                            src={image}
                            alt={genreImages[genre.genre].artistNames[i]}
                            className="artist-image"
                            title={genreImages[genre.genre].artistNames[i]}
                          />
                        </Tooltip>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="playlist-card">

        </div>
    </div>
    </div>
  );
}

export default Profile;
