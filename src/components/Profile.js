import React from "react";
import "../styles/home.css";
import Navbar from "./container/Navbar";

function Profile({accessToken}) {
        return (
        <div>
        <Navbar accessToken={accessToken} /> 
        </div>
        )
        }

export default Profile;