import Injector, { InjectorOptions } from "./Injector"

export default class IGReels extends Injector {
  constructor(options?: InjectorOptions) {
    super(options)
  }

  public beforeInject(): void {
    document.querySelectorAll('div[tabindex="0"] > svg').forEach((svg) => {
      svg.parentElement?.remove()
    })
  }

  public searchVideo(): void {
    let fallbackInterval = setInterval(() => {
      const video = document.querySelector("video")
      if (video?.readyState === 4) {
        this.inject(video as HTMLVideoElement, video.parentElement!)
        clearInterval(fallbackInterval)
      }
    }, 100)
  }

  public wayToInject(): void {
    const elements = document.elementsFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    if (elements[8]?.querySelector("button")) {
      elements[8].querySelector("button")?.addEventListener("click", () => {
        this.searchVideo()
      })
    } else if (elements[5] === undefined || elements[15] === undefined) return

    this.inject(elements[5] as HTMLVideoElement, elements[15] as HTMLElement)
  }
}
