import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Sidebar from "./container/Sidebar";
import axios from "axios";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import equaliser from "../assets/equaliser.gif";
import MediaQuery from 'react-responsive';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTool, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, ChartTool, Legend, ChartDataLabels);

const spotifyBg = ["#4b917d", "#f037a5", "#fa6700", "#1db954", "#7331a6"];

const genreEmo = {
  rock: '🎸', 
  pop: '🎤',
  jazz: '🎷', 
  blues: '🎵', 
  classical: '🎻', 
  country: '🤠', 
  hiphop: '🎤🎧', 
  electronic: '🎧🎶', 
  reggae: '🇯🇲🎵', 
  metal: '🤘🎸', 
  folk: '🌾🎻', 
  rnb: '🎵❤️', 
  indie: '🎸🎶', 
  alternative: '🎵🤘', 
  punk: '🎸🤘', 
  latin: '🎶💃', 
  gospel: '🎵🙏', 
  techno: '🎧💻',
  others: '✨'
}

function formatDuration(milliseconds) {
  const duration = Math.max(0, milliseconds);
 
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${formattedSeconds}`;
}


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
  const [playlist, setPlaylist] = useState([]);
  const [genreImages, setGenreImages] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {

    const fetchUser = async () => {
      try {
        const userResponse = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { display_name, images, email, followers, external_urls } =
          userResponse.data;

        const playlistResponse = await axios.get(
          "https://api.spotify.com/v1/me/playlists?limit=50",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const spl = playlistResponse.data.items;
        setPlaylist(spl);

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
    percentage: ((genreCount[genre] / totalGenres) * 100).toFixed(1), // Fix the precision to 1 decimal place
  };
});

const topGenres = genrePercentages.sort((a, b) => b.percentage - a.percentage).slice(0, 5);

const sumOfTopPercentages = topGenres.reduce((acc, genre) => acc + parseFloat(genre.percentage), 0);

const adjustmentFactor = 100 / sumOfTopPercentages;

topGenres.forEach(genre => {
  genre.percentage = (parseFloat(genre.percentage) * adjustmentFactor).toFixed(1);
});

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
        }, 500);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [accessToken]);


    const [nowPlaying, setNowPlaying] = useState({});
  
    useEffect(() => {
      const fetchNowPlaying = async () => {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
  
          const nowPlayingData = response.data;
          if (!nowPlayingData) {
            setNowPlaying({});
          } else {
            setNowPlaying(nowPlayingData); 
          }
        } catch (error) {
          console.error('Error fetching now playing data:', error);
        }
      };
  
      fetchNowPlaying();
  
      const intervalId = setInterval(fetchNowPlaying, 1000);
  
      return () => clearInterval(intervalId);
    }, [accessToken]);

  return (
    <div className="app-container">
      <Sidebar accessToken={accessToken} />
      <div className="main-content">
      {isLoaded ? (
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
                {userInfo.name}{" "}
                <span className="email">({userInfo.email})</span>
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

        
        
          <div className="np-card" style={{
            transform: nowPlaying.item && nowPlaying.actions?.disallows.resuming ? "translateX(0)" : "translateX(110%)"
          }}> 
          {nowPlaying.item && (
            <>
          <img className="np-card-img" alt={nowPlaying.item.name} src={nowPlaying.item.album.images[0].url} />
          <img className="np-card-content-img" alt={nowPlaying.item.name} src={nowPlaying.item.album.images[0].url} />
                     <div className="np-card-content-text">
              <h2>
                {nowPlaying.item.name}
              </h2>
              
  {nowPlaying.item.artists.length === 1
    ? 
    (
      <h3>
    {nowPlaying.item.artists[0].name} &#x2022; {formatDuration(nowPlaying.progress_ms)} / {formatDuration(nowPlaying.item.duration_ms)}
    </h3>
        )
    : nowPlaying.item.artists.length === 2
    ? 
    (
    <h3> 
      {nowPlaying.item.artists.map((a) => a.name).join(', ')} &#x2022; {formatDuration(nowPlaying.progress_ms)} / {formatDuration(nowPlaying.item.duration_ms)}
      </h3>
    )
    : ( 
      <Tooltip title={nowPlaying.item.artists.map((a) => a.name).join(", ")} arrow="true" size="small">
      <h3>
      {nowPlaying.item.artists[0].name}, +{nowPlaying.item.artists.length - 1} more &#x2022; {formatDuration(nowPlaying.progress_ms)} / {formatDuration(nowPlaying.item.duration_ms)}
      </h3>
      </Tooltip>
      )}
         
            </div>
          <img className="np-card-equaliser" alt="equaliser" src={equaliser} />
</>
          )}
          </div>
       
          
        </>
      ) : (
        <>
          <div className="info-load-card">
            <div className="info-load-card-content-img"></div>

            <div className="info-load-card-content-text">
              <div className="stats-load-title"></div>
              <div className="stats-load-subtitle"></div>
            </div>
          </div>
        </>
      )}



      <div class="pf-card-container">
        
        <div className="genre-card">
          <h4 className="card-title">Top Genres</h4>
          <MediaQuery minWidth={769}>
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
                      width: `${isLoaded ? genre.percentage - 5 : 1}pc`,
                      backgroundColor: `${spotifyBg[index]}`,
                    }}
                  >
                    <span
                      className={"genre-percent"}
                      style={{ opacity: `${isLoaded ? 1 : 0}` }}
                    >
                      {genre.percentage}%
                    </span>
                  </div>
                  <div
                    className="artist-images-container"
                    style={{ opacity: `${isLoaded ? 1 : 0}` }}
                  >
                    {genreImages[genre.genre] &&
                      genreImages[genre.genre].images.map((image, i) => (
                        <Tooltip
                          title={genreImages[genre.genre].artistNames[i]}
                          arrow="true"
                          size="small"
                        >
                          <img
                            key={i}
                            src={image}
                            alt={genreImages[genre.genre].artistNames[i]}
                            className="artist-image"
                          />
                        </Tooltip>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </MediaQuery>
          <MediaQuery maxWidth={768}>
          <br />
      <Doughnut data={{
       labels: topGenres.map((genre) => (
        genreEmo[Object.keys(genreEmo).find(g => genre.genre.includes(g)) || "others"] + " " + genre.genre.charAt(0).toUpperCase() + genre.genre.slice(1))
        ),
       datasets: [
         {
            label: 'Percentage',
            data: topGenres.map((genre) => (genre.percentage)), 
           backgroundColor: spotifyBg,
           hoverOffset: 4,
           borderWidth: 2
         },
       ],
    }}  options={{
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
              family: 'Circular',
              weight: 'bold',
            },
            color: '#fff',
            padding: 15,
          },
          onClick: (e, legendItem) => {
            e.stopPropagation();
          },
        },
        datalabels: {
          formatter: (value, ctx) => {
            const percentage = ctx.chart.data.datasets[0].data[ctx.dataIndex];
            return `${percentage}%`;
          },
          color: '#fff',
          backgroundColor: 'transparent',
          borderRadius: 5,
          padding: {
            top: 5,
            bottom: 5,
          },
          font: { 
            family: 'Circular', 
            size: 16,      
            weight: 'bold',
          },
        },
      },
    }}  />
            
          </MediaQuery>
        </div>

        <div className="playlist-card">
          <h4 className="card-title">Playlists</h4>
          <div className="playlist-container">
          {playlist.slice().reverse().map((list, index) => (
  <div className="spl-card" key={index}>
    <img
      className="spl-image"
      src={list.images[0].url}
      alt={list.name}
    />
    <p className="spl-name">{list.name}</p>
  </div>
))}

          </div>
        </div>
        <div className="nowplaying">
          <p>{formatDuration(nowPlaying.progress_ms)}</p>

        </div>
      </div>
      </div>
    </div> 
  );
}

export default Profile;
