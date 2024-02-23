import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getTrack } from './container/getTrack';
import {Link} from 'react-router-dom';
import {serverUri} from '../config';

function Download() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trackId = queryParams.get('id');
  const uid = localStorage.getItem('uid')
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] =useState(false);

  const isMounted = useRef(false);
  useEffect(() => {
    const fetchTrack = async () => {
      setLoading(true);
      const trackData = await getTrack(trackId);
      setTrack(trackData);
  
      fetch(`${serverUri}/convert/${uid}/${trackId}`, {method: 'POST'})
        .then((res) => res.json())
        .then((data) => setDownloading(true));
      
      setLoading(false);
    };
    
    if (!isMounted.current) {
      isMounted.current = true;
      fetchTrack();
    }
  
    const intervalId = setInterval(async () => {
      try {
        if (downloading) {
          const rep = await fetch(`${serverUri}/progress/${uid}/${trackId}`)
            .then((res) => res.json())
            .catch((e) => setProgress(0));
    
          if (!rep) return setProgress(0);
          if (rep.downloaded) {
            setDownloaded(true);
            clearInterval(intervalId);
          }
          setProgress(rep.progress);
        }
      } catch (e) {
      }
      
    }, 1000);
  
 /*   const timeoutId = setTimeout(async () => {
      fetch(`${serverUri}/delete/${uid}`, {method: 'POST'})
        .then((res) => res.json())
        .then((data) => console.log(data.success));
    }, 900000); */
  
    return () => {
      clearInterval(intervalId);
      //clearTimeout(timeoutId);
    };
  
  }, [uid, trackId, downloading]);
  


  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : !track ? (
        <h1>Invalid</h1>
      ) : (
        <div>
          <h1>{track.name}</h1>
          {downloaded ? (
          <Link to={`${serverUri}/download/${uid}/${trackId}`}><h2>DOWNLOAD</h2></Link>
          ) : (
            <>
          <h2>{progress}</h2>
          <div className="progress" style={{
            width: `${progress === 0 ? 1 : progress  / 4}pc`
          }}></div>
          </>
          )}
        </div>
      )}
    </div>
  );
}

export default Download;
