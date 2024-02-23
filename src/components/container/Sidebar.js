import React, { useState, useEffect } from 'react';
import '../../styles/global.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faChartBar, faListUl, faCircleDown } from '@fortawesome/free-solid-svg-icons'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function Sidebar({ accessToken }) {
  const sidebarItems = [
    { id: 1, label: 'Home', icon: faHome },
    { id: 2, label: 'Statistics', icon: faChartBar },
    { id: 3, label: 'Downloader', icon: faCircleDown }
  ];

  const [userInfo, setUserInfo] = useState({ image: null, name: null })
  const [playlist, setPlaylist] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchUser = async() => { 
    const userRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const plRes = await axios.get(
      "https://api.spotify.com/v1/me/playlists?limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const spl = plRes.data.items;
    setPlaylist(spl);

    setUserInfo({name: userRes.data.display_name, image: userRes.data.images[0].url })

    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }
  fetchUser()
  }, [accessToken])

  return (
    <div className="sidebar-container">
    <div className="sidebar-top">

    <Link to='/profile' style={{ textDecoration: 'none' }}>
      <div className='user-profile'>
        {!loaded ? (
          <>
          <Skeleton variant="circular" height={28} width={28} sx={{ bgcolor: '#303438' }} />
          <Box sx={{marginLeft: '5px' }}>
          <Skeleton variant="rounded" height={15} width={60} sx={{bgcolor: '#303438' }} />
          </Box>
          </>
        ) : (
          <>
        <img className='user-img' alt='' src={userInfo.image} />
        <div className='user-txt'>
        <span className='user-name'>{userInfo.name}</span>
        <span className='user-vp'>View Profile</span>
        </div>
        </>
        )}
      </div>
    </Link>

      <ul className="sidebar-menu">
        {sidebarItems.map(item => (
          <>
           <Link to={`/${item.label.toLowerCase()}`}>
          <li key={item.id} className="sidebar-item">
         
              <span><FontAwesomeIcon icon={item.icon} /> {item.label}</span>
          </li>
          </Link>
          </>
        ))}
      </ul>
    </div>
    <div className='sidebar-bottom'>
    <p className='playlist-header'><FontAwesomeIcon icon={faListUl} /> Playlists</p>
      <div className='playlist-container'>
        {playlist.slice().reverse().map((list, index) => (
          <div className='playlist-card' key={index}>
             <img
      className="playlist-image"
      src={list.images[0].url}
      alt={list.name}
    />
    <div className='playlist-text-container'>
      <p className='playlist-title'>{list.name}</p>
      <span className='playlist-subtitle'>{list.owner.display_name} <span style={{fontSize: '8px'}}>&#8226;</span> {list.tracks.total} Songs</span>
    </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Sidebar;
