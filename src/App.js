import React from "react";
import { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { useWebcamCapture } from "./useWebcamCapture";
import { FiDownload, FiShare2, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

import slap from "./stickers/slap.png";
import heart from "./stickers/heart.png";
import sleepy from "./stickers/sleepy.png";
import selfie from "./stickers/selfie.png";
import hungry from "./stickers/hungry.png";
import girin from "./stickers/girin.png";
import friends from "./stickers/friends.png";
import brain from "./stickers/brain.png";

import backgroundImage from "./christmas.jpg";

// Import the background image file
const useStyles = createUseStyles((theme) => ({
  "@global body": {
    // background: theme.palette.background,
    background: `url(${backgroundImage})`, // Use the imported background image
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    color: theme.palette.text,
    fontFamily: "sans-serif",
  },

  App: {
    padding: "20px",
    // background: theme.palette.primary,
    maxWidth: "800px",
    minHeight: "600px",
    margin: "auto",
    "& a": {
      color: theme.palette.text,
    },
  },
  Header: {
    "&  h1": {
      fontFamily: "sans-serif",
      cursor: "pointer",
      fontSize: "4rem",
    },
  },
  Main: {
    background: theme.palette.secondary,
    border: "10px solid black",
    borderRadius: "8px",
    overflow: "hidden",

    "& canvas": {
      width: "100%",
      height: "auto",
    },
    "& video": {
      display: "none",
    },
  },
  Stickers: {
    "& img": {
      height: "4rem",
    },
  },
  Gallery: {
    "& img": {
      height: "16rem",
    },
  },
  Picture: {
    background: "black",
    padding: 4,
    position: "relative",
    display: "inline-block",
    "& h3": {
      padding: 8,
      textAlign: "center",
      width: "100%",
    },
  },
}));

const stickers = [
  {
    url: slap,
    title: "SLAPPE!"
  },
  {
    url: heart,
    title: "LOVELY!"
  },
  {
    url: sleepy,
    title: "SLEEPY!"
  },
  {
    url: selfie,
    title: "SELFIE!"
  },
  {
    url: hungry,
    title: "HUNGRY!"
  },
  {
    url: girin,
    title: "GIRIN!"
  },
  {
    url: friends,
    title: "FRIENDLY!"
  },
  {
    url: brain,
    title: "SMART!"
  }
].map(({ url, title }) => {
  const img = document.createElement("img");
  img.src = url;
  return { img, url, title };
});


function App(props) {
  // css classes from JSS hook
  const classes = useStyles(props);
  // currently active sticker
  const [sticker, setSticker] = useState();
  // title for the picture that will be captured
  const [title, setTitle] = useState('...');
  const [sharePlatform, setSharePlatform] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState();

  // webcam behavior hook
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    pictures, // latest captured picture data object
  ] = useWebcamCapture(sticker?.img, title);

  const handleDownload = (dataUri, title) => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `${title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (dataUri, title) => {
    console.log(`Sharing picture: ${title}, dataUri: ${dataUri}`);
    setSharePlatform(null); // Close the dropdown after sharing
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        // reset sticker and title
        setSticker()
        setTitle('...')
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return (
    <div className={classes.App}>
      <header className={classes.Header}>
        <h1>SlapSticker</h1>
        <p>
          Have you ever said something so dumb, you just wanted to slap
          yourself? Well now you can!
        </p>
      </header>
      <main>
        <section className={classes.Gallery}>
          Message:
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </section>
        <section className={classes.Stickers}>
          {
            stickers.map((sticker) => (
              <button onClick={() => {
                setSticker(sticker)
                setTitle(sticker.title)
              }
              }>
                <img src={sticker.url} alt="sticker" />
              </button>)
            )}
        </section>
        <section className={classes.Main}>
          <video ref={handleVideoRef} />
          <canvas
            ref={handleCanvasRef}
            width={2}
            height={2}
            onClick={handleCapture}
          />
        </section>
        <section className={classes.Gallery}>
          Cherish this moment forever
          <br />
          {pictures && pictures.map((picture, index) =>
          (<div className={classes.Picture} key={index}>
            <img src={picture.dataUri} alt={picture.title} />
            <h3>{picture.title}</h3>
            <button onClick={() => handleDownload(picture.dataUri, `captured-${index}`)}><FiDownload /></button>
            <div className="dropdown">
              <button className="dropdown-toggle" onClick={() => {
                setSelectedImageIndex(index)
                setSharePlatform(prev => prev === null ? 'open' : null)
              }
              }>
                <FiShare2 />
              </button>
              {sharePlatform && selectedImageIndex === index && (
                <div className="dropdown-menu">
                  <button onClick={() => handleShare(picture.dataUri, `captured-${index}`, 'Facebook')}>
                    <FiFacebook />
                  </button>
                  <button onClick={() => handleShare(picture.dataUri, `captured-${index}`, 'Instagram')}>
                    <FiInstagram />
                  </button>
                  <button onClick={() => handleShare(picture.dataUri, `captured-${index}`, 'Twitter')}>
                    <FiTwitter />
                  </button>
                </div>
              )}
            </div>
          </div>)
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
