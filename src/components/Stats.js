import React from "react";
import TrackContainer from "./container/Track"; 
import "../styles/home.css";
import Navbar from "./container/Navbar";

const Stats = ({
  accessToken,
  userName
}) => {
  return (
    <div>
    <Navbar accessToken={accessToken} />
    <TrackContainer info={{ display_name: userName, }} accessToken={accessToken} />
    </div>
  );
};

export default Stats;
