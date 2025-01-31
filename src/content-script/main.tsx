import { Home, Reels } from "./modules/instagram"

const REGEX =
  /^(?:https?:\/\/(?:www\.)?instagram\.com)?(?:\/[\w.-]+)?\/(stories|reels|reel|p)\/([\w.-]+)(?:\/([\w.-]+))?\/?$/i
const home = new Home()
const reels = new Reels()
// const stories = new Stories()

let previousUrl = ""
const load = () => {
  const match = location.pathname.match(REGEX)
  const first = match?.[1]
  if (location.pathname === "/" || first === "p" || first === "reel") {
    reels.delete()
    // stories.delete()
    home.wayToInject()
  } else if (first === "reels") {
    home.delete()
    // stories.delete()
    reels.wayToInject()
  } else if (first === "stories") {
    home.delete()
    reels.delete()
    // stories.wayToInject()
  } else {
    home.delete()
    reels.delete()
    // stories.delete()
  }
}

setInterval(() => {
  if (location.href !== previousUrl) {
    previousUrl = location.href
    load()
  }
}, 100)

document.addEventListener("DOMContentLoaded", load)
