import React from "react"
import { createRoot } from "react-dom/client"
import Controller from "../components/Controller"

export type Injected = [HTMLVideoElement, HTMLElement][]

export interface InjectorOptions {
  IMPROVE_PERFORMANCE?: boolean
  MIN_REMOVE_COUNT?: number
  REMOVE_COUNT?: number
}

export default class Injector {
  private IMPROVE_PERFORMANCE = false
  private MIN_REMOVE_COUNT = 4
  private REMOVE_COUNT = 3
  private injectedList: Injected = []

  constructor(options: InjectorOptions | undefined) {
    this.MIN_REMOVE_COUNT = options?.MIN_REMOVE_COUNT || this.MIN_REMOVE_COUNT
    this.REMOVE_COUNT = options?.REMOVE_COUNT || this.REMOVE_COUNT
    this.IMPROVE_PERFORMANCE =
      options?.IMPROVE_PERFORMANCE || this.IMPROVE_PERFORMANCE
  }

  /**
   * This method is called before the elements are injected.
   * @example
   * ```ts
   * const injector = new Injector();
   * injector.beforeInject = () => {
   *  console.log("Injecting...");
   * }
   * injector.inject();
   * ```
   * @returns {void}
   */
  public beforeInject() {}

  /**
   * This method is called after the elements are injected.
   * @example
   * ```ts
   * const injector = new Injector();
   * injector.injected = () => {
   *  console.log("Injected!");
   * }
   * injector.inject();
   * ```
   */
  public injected() {}

  /**
   * This method is called before the elements are deleted.
   * @example
   * ```ts
   * const injector = new Injector();
   * injector.beforeDelete = () => {
   *  console.log("Deleting...");
   * }
   * injector.delete();
   * ```
   */
  public beforeDelete() {}

  /**
   * This method is called after the elements are deleted.
   * @example
   * ```ts
   * const injector = new Injector();
   * injector.deleted = () => {
   *  console.log("Deleted!");
   * }
   * injector.delete();
   * ```
   */
  public deleted() {}

  /**
   * This method is custom way to inject.
   * @example
   * ```ts
   * const injector = new Injector();
   * injector.wayToInject = () => {
   *  const video = document.querySelector("video");
   *  if (!video) return;
   *  this.inject(video as HTMLVideoElement, video.parentElement!);
   * }
   * injector.wayToInject();
   * ```
   */
  public wayToInject() {}

  private clear() {
    if (
      this.injectedList.length > this.MIN_REMOVE_COUNT &&
      this.IMPROVE_PERFORMANCE
    ) {
      for (let i = 0; i < this.REMOVE_COUNT; i++) {
        const [_, parent] = this.injectedList.shift()!
        parent.remove()
      }
    }
  }

  /**
   * This method deletes the injected elements.
   * @returns {void}
   */
  public delete() {
    this.beforeDelete()
    this.injectedList.forEach(([_, parent]) => {
      parent.remove()
    })
    this.injectedList.splice(0, this.injectedList.length)
    this.deleted()
  }

  /**
   * This method inject the Controller component to the video element.
   * @param video {HTMLVideoElement}
   * @param parent {HTMLElement}
   * @returns {void}
   */
  public inject(video: HTMLVideoElement, parent: HTMLElement) {
    if (
      !video ||
      !video?.parentElement ||
      !video?.src ||
      video?.getAttribute("better-ig-injected") !== null
    )
      return

    this.beforeInject()
    this.clear()

    video.setAttribute("better-ig-injected", "")

    const controller = document.createElement("div")
    controller.setAttribute("better-ig-inject", "")

    video.parentElement.style.setProperty("position", "relative")
    video.parentElement.appendChild(controller)
    video.currentTime = 0
    video.volume = 0

    const id = location.pathname.split("/")[2]
    const params = new URLSearchParams(location.search)
    const index = params.get("img_index")
    const igData: any = {}
    if (id) igData.id = id
    if (index) igData.index = parseInt(index)

    createRoot(controller).render(
      <Controller video={video} igData={igData?.id ? igData : undefined} />
    )

    this.injectedList.push([video, parent])

    this.injected()
  }

  public isInjected(video: HTMLVideoElement) {
    return video.getAttribute("better-ig-injected") !== null
  }
}
