import IntervalInjector, { IntervalInjectorOptions } from "./IntervalInjector"

export default class IGReels extends IntervalInjector {
  constructor(options?: IntervalInjectorOptions) {
    super(options)
  }

  public beforeInject(): void {
    document.querySelectorAll('div[tabindex="0"] > svg').forEach((svg) => {
      svg.parentElement?.remove()
    })
  }
}
