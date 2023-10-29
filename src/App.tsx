/// <reference types="chrome" />

import "./App.css";

import Controller from "../content-script/src/Controller";
import { useEffect, useState } from "react";

function App() {
  const [video, setVideo] = useState<HTMLVideoElement>();

  useEffect(() => {
    const video = document.querySelector("video");
    if (video) {
      setVideo(video);
    }
  }, []);

  return (
    <div className="App">
      <div className="main-video-frame">
        <video src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4"></video>
        {video && <Controller video={video} />}
      </div>
    </div>
  );
}

export default App;
