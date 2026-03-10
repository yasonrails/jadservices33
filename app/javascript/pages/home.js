import { initRevealObserver } from "pages/home/reveal"
import { initCursor } from "pages/home/cursor"
import { initNavbarOnScroll } from "pages/home/navbar"
import { initHeroVideos } from "pages/home/videos"
import { initParallax } from "pages/home/parallax"
import { registerFormHandler } from "pages/home/form"

const initScrollTop = () => {
  const btn = document.querySelector(".scroll-top")
  if (!btn) return () => {}
  const onScroll = () => btn.classList.toggle("visible", window.scrollY > 400)
  window.addEventListener("scroll", onScroll, { passive: true })
  return () => window.removeEventListener("scroll", onScroll)
}

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
		initScrollTop(),
	].filter(Boolean)
}

document.addEventListener("turbo:load", initHomePage)
document.addEventListener("DOMContentLoaded", initHomePage)
window.addEventListener("load", initHomePage)

if (document.readyState === "interactive" || document.readyState === "complete") {
	initHomePage()
}

document.addEventListener("turbo:before-cache", cleanupHomePage)
