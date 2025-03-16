import "./style.css"

import { useCallback, useEffect, useRef, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useStorage } from "@plasmohq/storage/hook"

import type { DownloadableMedia, Variant } from "~modules/Injector"

import DownloadButton from "./Buttons/Download"
import VolumeButton from "./Buttons/Volume"
import ProgressBarHorizontal from "./ProgressBarHorizontal"
import ProgressBarVertical from "./ProgressBarVertical"
import SmartContainer from "./SmartContainer"

type Props = {
  downloadableMedia?: DownloadableMedia
  video: HTMLVideoElement
  variant?: Variant
}

export default function Controller({
  video,
  downloadableMedia,
  variant
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(video)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [volumeDragging, setVolumeDragging] = useState(false)

  const [volume, setVolume] = useLocalStorage(
    "better-instagram-videos-volume",
    0.5
  )
  const [muted, setMuted] = useLocalStorage(
    "better-instagram-videos-muted",
    false
  )
  const [maxVolumeBalance] = useStorage("bigv-max-volume-balance", 100)

  // ig reels start
  // play, playing, seeking, waiting, volumechange, progress/timeupdate, seeked, canplay, playing, canplaythrough

  const updateAudio = useCallback(() => {
    const normalizedVolume = Math.min(volume, 1)
    videoRef.current.volume = normalizedVolume
    videoRef.current.muted = muted
  }, [videoRef, volume, muted])

  const timeUpdate = useCallback(() => {
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    )
  }, [videoRef])

  const play = useCallback(() => {
    updateAudio()
  }, [updateAudio])

  const ended = useCallback(() => {
    videoRef.current.currentTime = 0
    videoRef.current.play()

    const autoSkip = localStorage.getItem("bigv-autoskip")
    if (
      autoSkip === "true" &&
      document.location.pathname.startsWith("/reels")
    ) {
      const snap = document.querySelector('[role="main"]>:last-child')
      if (snap) snap.scrollBy(0, 1000)
    }
  }, [videoRef])

  useEffect(() => {
    videoRef.current.addEventListener("timeupdate", timeUpdate)
    videoRef.current.addEventListener("play", play)
    videoRef.current.addEventListener("ended", ended)
    videoRef.current.addEventListener("volumechange", updateAudio)
    videoRef.current.addEventListener("seeked", updateAudio)
    return () => {
      videoRef.current.removeEventListener("timeupdate", timeUpdate)
      videoRef.current.removeEventListener("play", play)
      videoRef.current.removeEventListener("ended", ended)
      videoRef.current.removeEventListener("volumechange", updateAudio)
      videoRef.current.removeEventListener("seeked", updateAudio)
    }
  }, [videoRef, timeUpdate, play, ended, updateAudio])

  useEffect(() => {
    updateAudio()
  }, [videoRef, volume, muted])

  useEffect(() => {
    if (dragging) videoRef.current.pause()
    else videoRef.current.play().catch(() => {})
  }, [dragging])

  return (
    <>
      <SmartContainer dragging={volumeDragging}>
        <VolumeButton muted={muted} onChange={(_) => setMuted(_)} />
        <ProgressBarVertical
          progress={volume * maxVolumeBalance}
          onProgress={(_) => {
            const ps = _ / maxVolumeBalance
            setVolume(ps)
          }}
          onDragging={(_) => {
            setVolumeDragging(_)
            if (!_) setVolume(volume)
          }}
        />
      </SmartContainer>
      {variant === "default" && downloadableMedia && (
        <DownloadButton data={downloadableMedia} label={false} inside />
      )}
      <div className="better-ig-controller">
        {video && (
          <ProgressBarHorizontal
            progress={progress}
            videoDuration={videoRef.current.duration}
            onProgress={(progress) => {
              videoRef.current.currentTime =
                (progress / 100) * videoRef.current.duration
            }}
            onDragging={setDragging}
          />
        )}
      </div>
    </>
  )
}
