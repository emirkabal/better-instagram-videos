import React from "react";
import { createRoot } from "react-dom/client";
import Controller from "./Controller";

const injected: [HTMLVideoElement, HTMLElement, IntersectionObserver][] = [];
let injectedDOM = false;

const improvePerformence = () => {
  document.querySelectorAll('div[tabindex="0"] > svg').forEach((svg) => {
    svg.parentElement?.remove();
  });
  if (injected.length > 3) {
    for (let i = 0; i < 3; i++) {
      console.log("[better-ig] Removed", injected[i][0].src);
      injected[i][2].disconnect();
      injected[i][2].unobserve(injected[i][1]);
      injected[i][1].removeAttribute("better-ig-observer");
      injected[i][1].remove();
      injected[i][0].remove();
    }
    injected.splice(0, 3);
    console.log("[better-ig] Injected count:", injected.length);
  }
};

const inject = (
  video: HTMLVideoElement,
  mainParent: HTMLElement,
  observer: IntersectionObserver
) => {
  if (
    !video ||
    !video?.parentElement ||
    video?.getAttribute("better-ig-injected") !== null
  )
    return;
  improvePerformence();
  video.setAttribute("better-ig-injected", "true");

  const controller = document.createElement("div");
  controller?.setAttribute("better-ig-inject", "");

  video?.parentElement?.style?.setProperty("position", "relative");
  video?.parentElement?.appendChild(controller);

  createRoot(controller)?.render(
    <React.StrictMode>
      <Controller video={video} />
    </React.StrictMode>
  );

  try {
    injected.push([video, mainParent, observer]);
  } catch (error) {
    console.log(error);
  }

  const volume = localStorage.getItem("better-ig-volume")
    ? Number(localStorage.getItem("better-ig-volume"))
    : 0.5;
  video.currentTime = 0;
  video.volume = volume;
  console.log("[better-ig] Injected", video.src);
};

const injectObservers = (element: HTMLElement) => {
  injectedDOM = true;
  let observers = 0;

  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i] as HTMLElement;

    if (child?.getAttribute("better-ig-observer") !== null || observers > 4)
      continue;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      const video = (child as HTMLElement).querySelector(
        "video"
      ) as HTMLVideoElement;
      if (!video) return;

      if (video.readyState > 0 && video.readyState < 4)
        video.addEventListener("loadeddata", () => {
          inject(video, child as HTMLElement, observer);
        });
      else inject(video, child as HTMLElement, observer);
    });

    (child as HTMLElement).setAttribute("better-ig-observer", "");
    observers++;

    observer.observe(child as HTMLElement);
  }

  setTimeout(() => injectObservers(element), 1500);
};

const injectAll = () => {
  const main = document.querySelector("main") as HTMLElement | null;
  const scrollSnapDiv = main?.firstChild as HTMLElement | null;
  if (main && scrollSnapDiv) injectObservers(scrollSnapDiv);
};

document.addEventListener("DOMContentLoaded", injectAll);

setInterval(() => {
  if (injectedDOM) return;
  const main = document.querySelector("main") as HTMLElement | null;
  const scrollSnapDiv = main?.firstChild as HTMLElement | null;
  if (main || scrollSnapDiv) injectAll();
}, 1000);
