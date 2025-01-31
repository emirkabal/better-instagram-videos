import { createRoot } from "react-dom/client"
import IntervalInjector, { IntervalInjectorOptions } from "../IntervalInjector"
import Buttons from "../../components/Buttons"
import { InjectedProps } from "../Injector"

export default class Reels extends IntervalInjector {
  private commentsInterval: NodeJS.Timeout | null = null
  private pauseOnComments = true

  constructor(options?: IntervalInjectorOptions) {
    super({
      ...options,
      variant: "reels"
    })

    chrome.storage.sync.get(["bigv-pause-on-comments"], (result) => {
      this.pauseOnComments = result["bigv-pause-on-comments"] ?? true
    })

    chrome.storage.sync.onChanged.addListener((changes) => {
      if (changes["bigv-pause-on-comments"]) {
        this.pauseOnComments =
          changes["bigv-pause-on-comments"].newValue ?? true
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
