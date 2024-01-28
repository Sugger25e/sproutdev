import React from 'react';
import { Navigate } from 'react-router-dom';

const Callback = ({ handleCallback }) => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (code) {
    handleCallback(code);
    return <Navigate to="/home" />;
  }

  return <div>Code parameter is missing</div>;
};

export default Callback;
