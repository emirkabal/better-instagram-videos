import Injector, { InjectorOptions } from "./Injector"

export interface IGHomeOptions extends InjectorOptions {
  INTERVAL_MS?: number
}

export default class IGHome extends Injector {
  private INTERVAL_MS = 800
  private interval: NodeJS.Timeout | number | undefined

  constructor(options?: IGHomeOptions) {
    super(options)
    this.INTERVAL_MS = options?.INTERVAL_MS || this.INTERVAL_MS
  }

  public beforeInject(): void {
    document
      .querySelectorAll("div > button[aria-label] > div > svg")
      .forEach((svg) => {
        svg.parentElement?.parentElement?.parentElement?.remove()
      })
  }

  public deleted(): void {
    if (this.interval) clearInterval(this.interval)
  }

  public wayToInject(): void {
    const fn = () => {
      const videos = document.querySelectorAll("video")
      if (videos.length === 0) return
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i]
        if (this.isInjected(video as HTMLVideoElement)) continue
        ;["timeupdate", "play", "playing"].forEach((event) =>
          video.addEventListener(event, () => {
            this.inject(video as HTMLVideoElement, video.parentElement!)
          })
        )
      }
    }

    fn()
    if (this.interval) clearInterval(this.interval)
    this.interval = setInterval(fn, this.INTERVAL_MS)
  }
}
