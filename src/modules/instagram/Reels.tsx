import { createRoot } from "react-dom/client"

import { Storage } from "@plasmohq/storage"

import Buttons from "~components/Buttons"

import type { InjectedProps } from "../Injector"
import IntervalInjector, {
  type IntervalInjectorOptions
} from "../IntervalInjector"

export default class Reels extends IntervalInjector {
  private commentsInterval: NodeJS.Timeout | null = null
  private pauseOnComments = true

  constructor(options?: IntervalInjectorOptions) {
    super({
      ...options,
      variant: "reels"
    })

    this.loadState()
  }

  public async loadState() {
    const storage = new Storage()
    this.pauseOnComments = (await storage.get("bigv-pause-on-comments")) ?? true
    storage.watch({
      "bigv-pause-on-comments": (c) => {
        this.pauseOnComments = c.newValue
      }
    })
  }

  public beforeInject(): void {
    // Remove the mute & unmute button
    document
      .querySelectorAll(
        'div[aria-disabled="false"][role="button"] > div > div[tabindex="0"][role="button"] > svg'
      )
      .forEach((svg) => {
        svg.parentElement?.remove()
      })
  }

  public beforeDelete(): void {
    if (this.commentsInterval) {
      clearInterval(this.commentsInterval)
      this.commentsInterval = null
    }
  }

  public injected(props: InjectedProps): void {
    if (!this.lastInjected) return

    const container =
      this.lastInjected[1]?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.querySelector(
        "&>:last-child"
      )
    if (!container) return

    const buttons = document.createElement("div")
    buttons.setAttribute("bigv-inject", "")
    buttons.classList.add("bigv-buttons")
    container.insertAdjacentElement("afterbegin", buttons)

    createRoot(buttons).render(
      <Buttons ctx={{ download: props.downloadableMedia ?? undefined }} />
    )

    if (this.commentsInterval) clearInterval(this.commentsInterval)

    this.commentsInterval = setInterval(() => {
      if (!this.pauseOnComments) return

      const commentsDialog = document.querySelector("div[role='dialog']")
      if (commentsDialog) {
        document.querySelectorAll("video").forEach((v) => {
          if (!v.paused) v.pause()
        })
      }
    }, 750)
  }
}
