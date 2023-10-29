/// <reference types="chrome" />

import { useEffect, useRef, useState } from "react";
import "./style.css";

type Props = {
  progress?: number;
  chunksVal?: number;
  onProgress?: (progress: number) => void;
  onDragging?: (dragging: boolean) => void;
};

export default function ProgressBarVertical({
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

  let lastY = 0;
  const mouseMoveEvent = (e: MouseEvent, click = false) => {
    if ((e.clientY === lastY || !isDragging) && !click) return;
    lastY = 0;
    const rect = dragareaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = -(e.clientY - rect.top) + rect.height;
    const height = rect.height;
    const percent = y / height;
    if (percent >= 0 && percent <= 1) {
      if ((y - 6) / height >= 0) setPointerPosition(y - 6);
      else setPointerPosition(0);
      setProgressBar(percent * 100);
      if (onProgress) onProgress(percent * 100);
    }
  };

  const updateProgressBar = () => {
    if (isNaN(progress) || isDragging) return;
    setProgressBar(progress);
    const rect = dragareaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const height = rect.height;
    const percent = progress / 100;
    const y = height * percent;
    setPointerPosition(y - 6);
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

    const height = rect.height;
    const percent = progressBar / 100;
    const y = height * percent;
    setPointerPosition(y);
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
    <div className="better-ig-progress-bar-vertical">
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
            height: `${
              progressBar > 98 ? 100 : progressBar < 3.5 ? 0 : progressBar
            }%`,
          }}
        ></div>
        <div
          className="chunks"
          style={{
            height: `${chunks}%`,
          }}
        ></div>
        <div
          className="pointer"
          style={{
            transform: `translate3d(0,${pointerPosition - 4}px,0)`,
            opacity: isDragging ? 1 : 0,
          }}
        ></div>
      </div>
    </div>
  );
}
