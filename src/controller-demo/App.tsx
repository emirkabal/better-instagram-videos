import { useEffect, useRef, useState } from "react"
import Controller from "@/content-script/components/Controller"

export default function App() {
  const videoRef = useRef(null)
  const [video, setVideo] = useState<HTMLVideoElement | null>()

  useEffect(() => {
    setVideo(videoRef.current)
  }, [videoRef])

  return (
    <>
      <div className="demo-container">
        <div className="player">
          <video
            onClick={() => {
              if (video?.paused) video?.play()
              else video?.pause()
            }}
            src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4"
            ref={videoRef}
          ></video>

          {video && <Controller video={video} />}
        </div>
      </div>
    </>
  )
}
