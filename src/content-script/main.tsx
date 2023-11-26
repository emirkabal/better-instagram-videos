import { IGHome, IGReels } from "./modules"

let previousUrl = ""
const home = new IGHome()
const reels = new IGReels()

const fn = () => {
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

setInterval(() => {
  if (location.href !== previousUrl) {
    previousUrl = location.href
    fn()
  }
}, 100)

document.addEventListener("DOMContentLoaded", fn)
