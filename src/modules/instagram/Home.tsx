import { IG_HOME_VOLUME_INDICATOR } from "~utils/constants"

import IntervalInjector, {
  type IntervalInjectorOptions
} from "../IntervalInjector"

export default class Home extends IntervalInjector {
  constructor(options?: IntervalInjectorOptions) {
    super(options)
  }

  public beforeInject(): void {
    document.querySelectorAll(IG_HOME_VOLUME_INDICATOR).forEach((svg) => {
      svg.parentElement?.parentElement?.parentElement?.remove()
    })
  }
}
