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
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

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
  const [genreImages, setGenreImages] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [genreLoaded, setGenreLoaded] = useState(false);
  const [timeRanges] = useState(["short_term", "medium_term", "long_term"]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);

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
  
        setTimeout(() => {
          setLoaded(true);
        }, 500);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchGenres = async() => {
        const topArtistsResponse = await axios.get(
          `https://api.spotify.com/v1/me/top/artists?time_range=${timeRanges[selectedTimeIndex]}`,
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
    percentage: ((genreCount[genre] / totalGenres) * 100).toFixed(1),
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
          const artists = topArtistsResponse.data.items.filter(artist => artist.genres.includes(genre.genre)).slice(0, 3);
      const images = artists.map(artist => artist.images.length > 0 ? artist.images[0].url : "");
      const artistNames = artists.map(artist => artist.name);
 

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
          setGenreLoaded(true);
        }, 2000);
    }

    fetchUser();
    fetchGenres();
  }, [accessToken, timeRanges, selectedTimeIndex]);

  const handleTimeRangeChange = (index) => {
    setSelectedTimeIndex(index);
    setGenreLoaded(false);
  };

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
  
          <div className="info-card">
      {!loaded ? ( 
        <>
        <Box sx={{marginLeft: '20px', position: 'absolute'}}>
          <Skeleton variant="rounded" width={60} height={60} sx={{bgcolor: '#303438'}}></Skeleton>
        </Box>
        <Box sx={{marginLeft: '5.5pc', position: 'absolute'}}>
          <Box sx={{marginLeft: '10px', margin: 0, marginBottom: '8px' }}>
          <Skeleton variant="rounded" width={190} height={20} sx={{bgcolor: '#303438'}}></Skeleton>
          </Box>
          <Skeleton variant="rounded" width={120} height={15} sx={{bgcolor: '#303438'}}></Skeleton>
        </Box>
        </>
      ) : (
        <>
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
            </>
      )}
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

      <div class="pf-card-container">
        
        <div className="genre-card">
          <h4 className="card-title">Top Genres</h4>
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
          <MediaQuery minWidth={769}>
            <div className="genre-legend">
              {genreLoaded ? (
                <>
              {topGenres.map((genre, i) => (
                <>
                <div className="genre-color" style={{backgroundColor: `${spotifyBg[i]}`}}></div><p>{genre.genre.charAt(0).toUpperCase() + genre.genre.slice(1)}</p>
                </>
              ))}
              </>
              ) : (
                <>
              {[...Array(5)].map((_, i) => (
                <>
                <div className="genre-color" style={{backgroundColor: `${spotifyBg[i]}`}}></div>
                <Skeleton variant="rounded" width={60} height={15} sx={{bgcolor: '#303438', marginRight: '15px' }} />
                                </>
              ))}
                </>
              )}
            </div>
          <div className="genre-container">
            <div className="vertical-line"></div>
            <div className="genre-bar-container">
              {topGenres.map((genre, index) => (
                <div className="genre-bar-wrapper" key={index}>
                  <Tooltip title={genre.genre.charAt(0).toUpperCase() + genre.genre.slice(1)} arrow="true" size="small" trigger="click">
                  <div
                    className="genre-bar"
                    style={{
                      width: `${genreLoaded ? (genre.percentage / 2) : 3}pc`,
                      backgroundColor: `${spotifyBg[index]}`,
                    }}
                  >
                    <span
                      className={"genre-percent"}
                    >
                     {genreLoaded ? genre.percentage : '-.--'}%
                    </span>
                  </div>
                  </Tooltip>

                  <div className="artist-images-container">
                  {genreLoaded ? 
                  (
                  <>
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
                  </>
                 ) : (
                 <>
                 <Box sx={{ display: 'flex', marginLeft: '5px' }}>
                <Box sx={{paddingBottom: '3px', display: 'block', marginRight: '-10px', position: 'relative' }}>
                 <Skeleton variant="circular" height={28} width={28} sx={{ bgcolor: '#303438' }} />
                 </Box>
                 <Box sx={{paddingBottom: '3px', display: 'block', marginRight: '-10px', position: 'relative' }}>
                 <Skeleton variant="circular" height={28} width={28} sx={{ bgcolor: '#303438' }} />
                 </Box>
                 <Box sx={{paddingBottom: '3px', display: 'block', marginRight: '-10px', position: 'relative' }}>
                 <Skeleton variant="circular" height={28} width={28} sx={{ bgcolor: '#303438' }} />
                 </Box>
                 </Box>
                 </>)}
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

      
      </div>
      </div>
    </div> 
  );
}

export default Profile;
