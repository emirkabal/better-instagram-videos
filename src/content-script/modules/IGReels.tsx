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

  public injected(): void {
    // document.querySelectorAll("video").forEach((video) => {
    //   if (video.getAttribute("better-ig-injected") !== null) return;
    //   video.volume = 0;
    //   video.pause();
    // });
  }

  public wayToInject(): void {
    const elements = document.elementsFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    if (elements[5] === undefined || elements[15] === undefined) return
    this.inject(elements[5] as HTMLVideoElement, elements[15] as HTMLElement)
  }
}
