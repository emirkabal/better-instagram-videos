import { IGHome, IGReels } from "./modules"

let previousUrl = ""

const home = new IGHome()
const reels = new IGReels({
  IMPROVE_PERFORMANCE: true
})

setInterval(() => {
  if (location.href !== previousUrl) {
    previousUrl = location.href

    if (location.pathname === "/") {
      reels.delete()
      home.wayToInject()
    } else if (
      location.pathname.startsWith("/p/") ||
      location.pathname.startsWith("/reel/")
    ) {
      reels.delete()
      home.wayToInject()
    } else if (location.pathname.startsWith("/reels/")) {
      home.delete()
      reels.wayToInject()
    } else {
      home.delete()
      reels.delete()
    }
  }
}, 100)
