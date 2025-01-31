import IntervalInjector, { IntervalInjectorOptions } from "../IntervalInjector"

export default class Stories extends IntervalInjector {
  constructor(options?: IntervalInjectorOptions) {
    super({
      ...options,
      variant: "stories"
    })
  }

  public injected(): void {
    console.log("IGStories injected")
  }
}
