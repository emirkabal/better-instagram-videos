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

  const storageV = localStorage.getItem("better-instagram-controls-volume")
  const volume = useRef(
    storageV && !isNaN(storageV as any) ? parseFloat(storageV) : 0.5
  )
  const muted = useRef(false)

  const updateMuted = () => {
    videoRef.current.volume = muted.current ? 0 : volume.current
  }

  useEffect(() => {
    videoRef.current.addEventListener("timeupdate", () => {
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      )
      videoRef.current.muted = false
      updateMuted()
    })

    videoRef.current.addEventListener("play", () => {
      updateMuted()
    })
  }, [])

  useEffect(() => {
    updateMuted()
  }, [volume])

  useEffect(() => {
    updateMuted()
  }, [muted])

  useEffect(() => {
    if (dragging) videoRef.current.pause()
    else
      videoRef.current.play().catch(() => {
        setTimeout(() => {
          videoRef.current.currentTime = 0
          videoRef.current.play()
        }, 1)
      })
  }, [dragging])

  return (
    <>
      <VolumeButton
        muted={muted.current}
        onChange={(_) => (muted.current = _)}
      />
      <ProgressBarVertical
        progress={volume.current * 100}
        onProgress={(_) => {
          const progress = _ / 100
          videoRef.current.volume = progress
          volume.current = progress
        }}
        onDragging={(_) => {
          if (!_)
            localStorage.setItem(
              "better-instagram-controls-volume",
              volume.current.toString()
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
