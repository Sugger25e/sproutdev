import React, { useEffect } from 'react';
import * as config from "../config";

const clientId = 'c39541571c464661a271e06815f43ce1';
const redirectUri = config.redirectUri;

const Login = () => {
  useEffect(() => {
   
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=user-read-private%20user-read-email%20user-top-read%20user-follow-read&redirect_uri=${redirectUri}`;
  }, []); 

  return (
    <div>
      <p>Redirecting to Spotify login...</p>
    </div>
  );
};

export default Login;
