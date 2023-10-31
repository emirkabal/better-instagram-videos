/// <reference types="chrome" />

import "./style.css"
import { useEffect, useRef, useState } from "react"

import Container from "./Container"
import ProgressBarHorizontal from "./ProgressBarHorizontal"
import ProgressBarVertical from "./ProgressBarVertical"

type Props = {
  video: HTMLVideoElement
}

export default function Controller({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement>(video)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  const storageVol = localStorage.getItem("better-instagram-controls-volume")
  const [volume, setVolume] = useState(
    storageVol ? parseFloat(storageVol!) : 0.5
  )

  videoRef.current.addEventListener("timeupdate", () => {
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    )
    videoRef.current.muted = false
  })

  videoRef.current.addEventListener("play", () => {
    videoRef.current.volume = volume
  })

  useEffect(() => {
    videoRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (dragging) videoRef.current.pause()
    else videoRef.current.play()
  }, [dragging])

  return (
    <>
      <ProgressBarVertical
        progress={volume * 100}
        onProgress={(_) => {
          const progress = _ / 100
          videoRef.current.volume = progress
          setVolume(progress)
        }}
        onDragging={(_) => {
          if (!_)
            localStorage.setItem(
              "better-instagram-controls-volume",
              volume.toString()
            )
        }}
      />
      <div className="better-ig-controller">
        {video && (
          <Container dragging={dragging}>
            <ProgressBarHorizontal
              progress={progress}
              onProgress={(progress) => {
                videoRef.current.currentTime =
                  (progress / 100) * videoRef.current.duration
              }}
              onDragging={setDragging}
            />
          </Container>
        )}
      </div>
    </>
  )
}
