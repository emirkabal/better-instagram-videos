import { useEffect, useRef, useState } from "react"
import "./style.css"

type Props = {
  progress?: number
  chunksVal?: number
  onProgress?: (progress: number) => void
  onDragging?: (dragging: boolean) => void
  videoDuration?: number
}

export default function ProgressBarHorizontal({
  progress = 0,
  chunksVal = 0,
  onProgress,
  onDragging,
  videoDuration = 0
}: Props) {
  const [chunks, setChunks] = useState(chunksVal)
  const [progressBar, setProgressBar] = useState(progress)
  const [isDragging, setDragging] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const dragareaRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState(0)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = (seconds % 60).toFixed(1)

    if (minutes === 0) {
      return `${remainingSeconds}s`
    }
    return `${minutes}:${Math.floor(Number(remainingSeconds))
      .toString()
      .padStart(2, "0")}`
  }

  let lastX = 0
  const mouseMoveEvent = (e: MouseEvent, click = false) => {
    if (!click && !isDragging) return

    const rect = dragareaRef.current?.getBoundingClientRect()
    if (!rect) return

    const width = rect.width
    const x = Math.min(Math.max(e.clientX - rect.left, 0), width)
    const percent = Number((x / width).toFixed(4))

    if (percent >= 0 && percent <= 1) {
      setProgressBar(Math.round(percent * 10000) / 100)
      if (onProgress) onProgress(Math.round(percent * 10000) / 100)

      const tooltipWidth = 60
      const maxPosition = width - tooltipWidth / 2
      const minPosition = tooltipWidth / 2
      setTooltipPosition(Math.min(Math.max(x, minPosition), maxPosition))
      setMousePosition(percent)
    }

    lastX = e.clientX
  }

  const updateProgressBar = () => {
    if (isNaN(progress) || isDragging) return
    setProgressBar(progress)
  }

  useEffect(() => {
    updateProgressBar()
  }, [progress])

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveEvent)

    return () => {
      window.removeEventListener("mousemove", mouseMoveEvent)
    }
  }, [isDragging])

  const resizeEvent = () => {
    const rect = dragareaRef.current?.getBoundingClientRect()
    if (!rect) return

    const width = rect.width
    const percent = progressBar / 100
    const x = width * percent
    setProgressBar(progressBar)
  }

  useEffect(() => {
    window.addEventListener("resize", resizeEvent)
    return () => {
      window.removeEventListener("resize", resizeEvent)
    }
  }, [progressBar])

  useEffect(() => {
    window.addEventListener("mouseup", () => {
      setDragging(false)
    })
    window.addEventListener("mouseleave", () => {
      setDragging(false)
    })
  }, [])

  useEffect(() => {
    if (onDragging) onDragging(isDragging)
  }, [isDragging])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = dragareaRef.current?.getBoundingClientRect()
    if (!rect) return

    const width = rect.width
    const x = Math.min(Math.max(e.clientX - rect.left, 0), width)
    const tooltipWidth = 60
    const maxPosition = width - tooltipWidth / 2
    const minPosition = tooltipWidth / 2

    setTooltipPosition(Math.min(Math.max(x, minPosition), maxPosition))
    setMousePosition(x / width)
    setShowTooltip(true)
  }

  return (
    <div className="progress-bar-horizontal">
      <div className={`baseline ${isDragging ? "dragging" : ""}`}>
        <div
          ref={dragareaRef}
          className="dragarea"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowTooltip(false)}
          onMouseDown={(e) => [
            setDragging(true),
            mouseMoveEvent(e as any as MouseEvent, true)
          ]}
        ></div>
        <div
          className="fill"
          style={{
            width: `${
              progressBar > 99.5 ? 100 : progressBar < 0.5 ? 0 : progressBar
            }%`
          }}
        ></div>
        <div
          className="chunks"
          style={{
            width: `${chunks}%`
          }}
        ></div>
        {(showTooltip || isDragging) && (
          <div
            className={`better-ig-progress-tooltip ${
              showTooltip || isDragging ? "visible" : ""
            }`}
            style={{
              left: tooltipPosition
            }}
          >
            {formatTime(mousePosition * videoDuration)}
          </div>
        )}
      </div>
    </div>
  )
}
