import { initRevealObserver } from "pages/home/reveal"
import { initCursor } from "pages/home/cursor"
import { initNavbarOnScroll } from "pages/home/navbar"
import { initHeroVideos } from "pages/home/videos"
import { initParallax } from "pages/home/parallax"
import { registerFormHandler } from "pages/home/form"

let teardownCallbacks = []

const cleanupHomePage = () => {
	teardownCallbacks.forEach((teardown) => teardown())
	teardownCallbacks = []
}

const initHomePage = () => {
	if (!document.querySelector(".hero")) return

	cleanupHomePage()

	teardownCallbacks = [
		registerFormHandler(),
		initRevealObserver(),
		initCursor(),
		initNavbarOnScroll(),
		initHeroVideos(),
		initParallax(),
	].filter(Boolean)
}

document.addEventListener("turbo:load", initHomePage)
document.addEventListener("DOMContentLoaded", initHomePage)
window.addEventListener("load", initHomePage)

if (document.readyState === "interactive" || document.readyState === "complete") {
	initHomePage()
}

document.addEventListener("turbo:before-cache", cleanupHomePage)
