import { createRoot } from "react-dom/client"
import IntervalInjector, { IntervalInjectorOptions } from "./IntervalInjector"
import Buttons from "../components/Buttons"

export default class IGReels extends IntervalInjector {
  constructor(options?: IntervalInjectorOptions) {
    super(options)
  }

  public beforeInject(): void {
    document.querySelectorAll('div[tabindex="0"] > svg').forEach((svg) => {
      svg.parentElement?.remove()
    })
  }

  public injected(): void {
    if (!this.lastInjected) return

    const container =
      this.lastInjected[1]?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(
        "&>:last-child"
      )
    if (!container) return

    const buttons = document.createElement("div")
    buttons.setAttribute("bigv-inject", "")
    container.insertAdjacentElement("afterbegin", buttons)

    createRoot(buttons).render(<Buttons />)
  }
}
