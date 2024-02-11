import axios from 'axios';

import { client_id, client_secret, regex } from '../../config';

async function authenticate() {
  try {
    const auth_token = btoa(`${client_id}:${client_secret}`);

    const response = await axios.post('https://accounts.spotify.com/api/token', { grant_type: 'client_credentials' }, {
      headers: {
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;

  } catch (error) {
    console.log(error);
  }
}

async function getTrack(track) {
  const access_token = await authenticate();

  try {

    if (track.includes('open.spotify.com')) {
      const id = track.match(regex);
      if (!id) return;
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${id[0]}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      return response.data;
    } else if (track.match(/[a-zA-Z0-9]{15,}/g)) {
      const id = track.match(/[a-zA-Z0-9]{15,}/g);
      if (!id) return;
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });


      return response.data;
    } else {
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${track}&type=track`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      return response.data;
    }

  } catch (error) {
    console.log(error);
  }
}

export {
  getTrack, 
  authenticate
};
