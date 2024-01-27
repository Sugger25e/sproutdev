import React from "react";
import "../styles/home.css";
import Navbar from "./container/Navbar";

function About({accessToken}) {
        return (
        <div>
        <Navbar accessToken={accessToken} /> 
        </div>
        )
        }

export default About; 