/// <reference types="chrome" />

import { useEffect, useRef, useState } from "react";
import "./style.css";

import ProgressBarHorizontal from "./components/ProgressBarHorizontal";
import ProgressBarVertical from "./components/ProgressBarVertical";
import Container from "./components/Container";
import { getImage } from "../utils";

type Props = {
  video: HTMLVideoElement;
};

export default function Controller({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement>(video);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  videoRef.current.addEventListener("timeupdate", () => {
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
    try {
      videoRef.current.muted = false;
    } catch (error) {
      console.log("cant play", error);
    }
  });

  useEffect(() => {
    if (dragging) videoRef.current.pause();
    else videoRef.current.play();
  }, [dragging]);

  const toggle = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  return (
    <>
      <ProgressBarVertical
        progress={Number(localStorage.getItem("better-ig-volume")) * 100}
        onProgress={(progress) => {
          localStorage.setItem("better-ig-volume", (progress / 100).toString());
          videoRef.current.volume = progress / 100;
        }}
      />
      <div className="better-ig-controller">
        {video && (
          <Container dragging={dragging}>
            <button
              onClick={() => toggle()}
              style={{
                width: 24,
                height: 24,
              }}
            >
              {!videoRef.current.paused ? (
                <img
                  draggable={false}
                  src={getImage("./images/pause.png")}
                  width={24}
                  height={24}
                />
              ) : (
                <img
                  draggable={false}
                  src={getImage("./images/play.png")}
                  width={24}
                  height={24}
                />
              )}
            </button>
            <ProgressBarHorizontal
              progress={progress}
              onProgress={(progress) => {
                videoRef.current.currentTime =
                  (progress / 100) * videoRef.current.duration;
              }}
              onDragging={setDragging}
            />
          </Container>
        )}
      </div>
    </>
  );
}
