import "./style.css"
import { useEffect, useRef, useState } from "react"

import Container from "./Container"
import ProgressBarHorizontal from "./ProgressBarHorizontal"
import ProgressBarVertical from "./ProgressBarVertical"
import VolumeButton from "./Buttons/Volume"
import DownloadButton from "./Buttons/Download"

type Props = {
  igData?: {
    id: string
    index?: number
  }
  video: HTMLVideoElement
}

export default function Controller({ video, igData }: Props) {
  const videoRef = useRef<HTMLVideoElement>(video)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)

  const [storageV, storageM] = [
    localStorage.getItem("better-instagram-controls-volume"),
    localStorage.getItem("better-instagram-controls-muted")
  ]
  const [volume, setVolume] = useState(storageV ? parseFloat(storageV!) : 0.5)
  const [muted, setMuted] = useState(storageM ? storageM === "true" : false)

  videoRef.current.addEventListener("timeupdate", () => {
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    )
    videoRef.current.muted = muted
  })

  videoRef.current.addEventListener("play", () => {
    videoRef.current.volume = volume
  })

  useEffect(() => {
    videoRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    localStorage.setItem("better-instagram-controls-muted", muted.toString())
  }, [muted])

  useEffect(() => {
    if (dragging) videoRef.current.pause()
    else
      videoRef.current.play().catch(() => {
        setMuted(true)
        setTimeout(() => {
          videoRef.current.currentTime = 0
          videoRef.current.play()
        }, 1)
      })
  }, [dragging])

  return (
    <>
      <VolumeButton muted={muted} onChange={(_) => setMuted(_)} />
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
          <Container
            buttons={
              igData && (
                <>
                  <DownloadButton igData={igData} />
                </>
              )
            }
            dragging={dragging}
          >
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
