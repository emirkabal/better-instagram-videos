import Injector, { InjectorOptions } from "./Injector"

interface Options {
  INTERVAL_MS?: number
}

export type IntervalInjectorOptions = Options & InjectorOptions

export default class IntervalInjector extends Injector {
  private INTERVAL_MS = 100
  private interval: NodeJS.Timeout | number | undefined

  constructor(options?: IntervalInjectorOptions) {
    super(options)
    this.INTERVAL_MS = options?.INTERVAL_MS || this.INTERVAL_MS
  }

  public deleted(): void {
    if (this.interval) clearInterval(this.interval)
  }

  public injectMethod(): void {
    const videos = document.querySelectorAll("video")
    if (videos.length === 0) return
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i]
      if (
        this.isInjected(video as HTMLVideoElement) ||
        video.hasAttribute("better-ig-attached-listeners")
      )
        continue
      video.setAttribute("better-ig-attached-listeners", "")
      ;["play", "timeupdate", "playing"].forEach((event) => {
        video.addEventListener(event, () => {
          this.inject(video as HTMLVideoElement, video.parentElement!)
        })
      })
    }
  }

  public wayToInject(): void {
    if (this.interval) clearInterval(this.interval)
    this.injectMethod()
    this.interval = setInterval(() => this.injectMethod(), this.INTERVAL_MS)
  }
}
