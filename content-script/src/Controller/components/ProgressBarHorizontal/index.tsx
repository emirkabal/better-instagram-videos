/// <reference types="chrome" />

import { useEffect, useRef, useState } from "react";
import "./style.css";

type Props = {
  progress?: number;
  chunksVal?: number;
  onProgress?: (progress: number) => void;
  onDragging?: (dragging: boolean) => void;
};

export default function ProgressBarHorizontal({
  progress = 0,
  chunksVal = 0,
  onProgress,
  onDragging,
}: Props) {
  const [chunks, setChunks] = useState(chunksVal);
  const [progressBar, setProgressBar] = useState(progress);
  const [pointerPosition, setPointerPosition] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const dragareaRef = useRef<HTMLDivElement>(null);

  let lastX = 0;
  const mouseMoveEvent = (e: MouseEvent, click = false) => {
    if ((e.clientX === lastX || !isDragging) && !click) return;
    lastX = 0;
    const rect = dragareaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percent = x / width;
    if (percent >= 0 && percent <= 1) {
      setPointerPosition(x - 1);
      setProgressBar(percent * 100);
      if (onProgress) onProgress(percent * 100);
    }
  };

  const updateProgressBar = () => {
    if (isNaN(progress) || isDragging) return;
    setProgressBar(progress);
    const rect = dragareaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = rect.width;
    const percent = progress / 100;
    const x = width * percent;
    setPointerPosition(x);
  };

  useEffect(() => {
    updateProgressBar();
  }, [progress]);

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveEvent);

    return () => {
      window.removeEventListener("mousemove", mouseMoveEvent);
    };
  }, [isDragging]);

  const resizeEvent = () => {
    const rect = dragareaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const width = rect.width;
    const percent = progressBar / 100;
    const x = width * percent;
    setPointerPosition(x);
    setProgressBar(progressBar);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeEvent);
    return () => {
      window.removeEventListener("resize", resizeEvent);
    };
  }, [progressBar]);

  useEffect(() => {
    window.addEventListener("mouseup", () => {
      setDragging(false);
    });
    window.addEventListener("mouseleave", () => {
      setDragging(false);
    });
  }, []);

  useEffect(() => {
    if (onDragging) onDragging(isDragging);
  }, [isDragging]);

  return (
    <div className="progress-bar-horizontal">
      <div className="baseline">
        <div
          ref={dragareaRef}
          className="dragarea"
          onMouseDown={(e) => [
            setDragging(true),
            mouseMoveEvent(e as any as MouseEvent, true),
          ]}
        ></div>
        <div
          className="fill"
          style={{
            width: `${progressBar}%`,
          }}
        ></div>
        <div
          className="chunks"
          style={{
            width: `${chunks}%`,
          }}
        ></div>
        <div
          className="pointer"
          style={{
            transform: `translate3d(${pointerPosition - 4}px,0,0)`,
            opacity: isDragging ? 1 : 0,
          }}
        ></div>
      </div>
    </div>
  );
}
