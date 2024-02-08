import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import image0 from "../assets/genresn.png";
import image1 from "../assets/npn.png";
import image2 from "../assets/topn.png";
import MediaQuery from "react-responsive";

const images = [image0, image1, image2];

const Main = ({ accessToken }) => {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index]);

  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">
          Spr<span className="htitle">o</span>ut
        </h1>
        <h2 className="subtitle">
          Your go-to place for cool Spotify tools that make music even more
          awesome!
        </h2>
        <Link to={accessToken ? "/home" : "/login"}>
          <button className="gs-btn">
            {accessToken ? "View Features" : "Login"}
          </button>
        </Link>
      </div>

      <MediaQuery minWidth={1256}>
      <div className="slideshow-container">
      <div className="slideshow">
        <div
          className="slideshow-slider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {images.map((image, idx) => (
            <img
              key={idx}
              className="slideshow-img"
              src={image}
              alt={`ss ${idx + 1}`}
              onClick={() => {
                setIndex(idx);
              }}
            />
          ))}
        </div>
      </div>
      <div className="slideshow-dot-container">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`slideshow-dot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
      </div>
      </MediaQuery>
      <MediaQuery maxWidth={1254}>
        <div className="preview-container">
        <img className="preview-img" alt="prev-img-1" src={image0} />
        <img className="preview-img" alt="prev-img-2" src={image1} />
        <img className="preview-img" alt="prev-img-3" src={image2} />
        </div>
      </MediaQuery>
    </div>
  );
};

export default Main;
