import IntervalInjector, {
  type IntervalInjectorOptions
} from "../IntervalInjector"

export default class Home extends IntervalInjector {
  constructor(options?: IntervalInjectorOptions) {
    super(options)
  }

  public beforeInject(): void {
    document
      .querySelectorAll("div > button[aria-label] > div > svg")
      .forEach((svg) => {
        svg.parentElement?.parentElement?.parentElement?.remove()
      })
  }
}
