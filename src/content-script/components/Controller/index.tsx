import "./style.css"
import { useEffect, useRef, useState } from "react"

import Container from "./Container"
import ProgressBarHorizontal from "./ProgressBarHorizontal"
import ProgressBarVertical from "./ProgressBarVertical"
import VolumeButton from "./Buttons/Volume"
import DownloadButton from "./Buttons/Download"
import SmartContainer from "./SmartContainer"

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
  const [volumeDragging, setVolumeDragging] = useState(false)

  const storageV = localStorage.getItem("better-instagram-videos-volume")
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

    videoRef.current.addEventListener("ended", () => {
      const autoSkip = localStorage.getItem("bigv-autoskip")
      if (
        autoSkip === "true" &&
        document.location.pathname.startsWith("/reels")
      ) {
        const snap = document.querySelector('[role="main"]>:last-child')
        if (snap) snap.scrollBy(0, 1000)
      }
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
      <SmartContainer dragging={volumeDragging}>
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
            setVolumeDragging(_)
            if (!_)
              localStorage.setItem(
                "better-instagram-videos-volume",
                volume.current.toString()
              )
          }}
        />
      </SmartContainer>
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
