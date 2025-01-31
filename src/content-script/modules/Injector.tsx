import { createRoot } from "react-dom/client"
import Controller from "../components/Controller"

export type Injected = [HTMLVideoElement, HTMLElement][]
export type DownloadableMedia = {
  id: string
  index?: number
}
export type Variant = "default" | "reels" | "stories"
export interface InjectorOptions {
  improvePerformance?: boolean
  minRemoveCount?: number
  removeCount?: number
  variant?: Variant
}

export interface InjectedProps {
  video: HTMLVideoElement
  downloadableMedia?: DownloadableMedia
}

export default class Injector {
  private improvePerformance = false
  private minRemoveCount = 4
  private removeCount = 3
  private variant: Variant = "default"

  private injectedList: Injected = []

  constructor(options: InjectorOptions | undefined) {
    this.minRemoveCount = options?.minRemoveCount || this.minRemoveCount
    this.removeCount = options?.removeCount || this.removeCount
    this.improvePerformance =
      options?.improvePerformance || this.improvePerformance
    this.variant = options?.variant || this.variant
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
  public beforeInject(): void {}

  /**
   * This method is called after the elements are injected.
   * @param props {InjectedProps}
   * @example
   * ```ts
   * const injector = new Injector();
   * injector.injected = () => {
   *  console.log("Injected!");
   * }
   * injector.inject();
   * ```
   */
  public injected(props: InjectedProps): void {}

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
  public beforeDelete(): void {}

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
  public deleted(): void {}

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
  public wayToInject(): void {}

  get lastInjected() {
    return this.injectedList[this.injectedList.length - 1]
  }

  private clear() {
    if (
      this.injectedList.length > this.minRemoveCount &&
      this.improvePerformance
    ) {
      for (let i = 0; i < this.removeCount; i++) {
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
  public inject(video: HTMLVideoElement, parent: HTMLElement): void {
    if (
      !video ||
      !video?.parentElement ||
      !video?.src ||
      video?.hasAttribute("bigv-injected")
    )
      return

    this.beforeInject()
    this.clear()

    video.setAttribute("bigv-injected", "")

    const controller = document.createElement("div")
    controller.setAttribute("bigv-inject", "")

    video.parentElement.style.setProperty("position", "relative")
    video.parentElement.appendChild(controller)
    video.currentTime = 0
    video.volume = 0

    const id = location.pathname.split("/")[2]
    const params = new URLSearchParams(location.search)
    const index = params.get("img_index")
    const downloadableMedia: DownloadableMedia = {
      id: id ?? "",
      index: index ? parseInt(index) : undefined
    }

    createRoot(controller).render(
      <Controller
        video={video}
        variant={this.variant}
        downloadableMedia={
          downloadableMedia.id !== "" ? downloadableMedia : undefined
        }
      />
    )

    this.injectedList.push([video, parent])

    this.injected({
      video,
      downloadableMedia:
        downloadableMedia.id !== "" ? downloadableMedia : undefined
    })
  }

  public isInjected(video: HTMLVideoElement): boolean {
    return video.hasAttribute("bigv-injected")
  }
}
