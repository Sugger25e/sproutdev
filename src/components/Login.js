import React, { useEffect } from 'react';

const clientId = 'c39541571c464661a271e06815f43ce1';
const redirectUri = "https://sproutdev.netlify.app/callback";

const Login = () => {
  useEffect(() => {
   
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=user-read-private%20user-read-email%20user-top-read&redirect_uri=${redirectUri}`;
  }, []); 

  return (
    <div>
      <p>Redirecting to Spotify login...</p>
    </div>
  );
};

export default Login;
