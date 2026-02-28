let parallaxRafId = null
let videoIntervalId = null

const applyRevealObserver = () => {
	const items = document.querySelectorAll(".reveal")
	if (!items.length) return

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible")
					observer.unobserve(entry.target)
				}
			})
		},
		{ threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
	)

	items.forEach((item) => observer.observe(item))
}

const initCursor = () => {
	if (window.matchMedia("(hover: none)").matches) return

	const cursor = document.getElementById("cursor")
	const ring = document.getElementById("cursor-ring")
	if (!cursor || !ring) return

	document.addEventListener("mousemove", (event) => {
		cursor.style.left = `${event.clientX}px`
		cursor.style.top = `${event.clientY}px`
		ring.style.left = `${event.clientX}px`
		ring.style.top = `${event.clientY}px`
	})

	document.querySelectorAll("a, button, .service-card, .testi-card").forEach((node) => {
		node.addEventListener("mouseenter", () => ring.classList.add("hov"))
		node.addEventListener("mouseleave", () => ring.classList.remove("hov"))
	})
}

const initNavbarOnScroll = () => {
	const nav = document.getElementById("navbar")
	if (!nav) return

	const update = () => {
		nav.classList.toggle("scrolled", window.scrollY > 20)
	}

	update()
	window.addEventListener("scroll", update)
}

const initHeroVideos = () => {
	const videos = Array.from(document.querySelectorAll(".hero-video"))
	const dots = Array.from(document.querySelectorAll(".hero-dot"))
	if (!videos.length || !dots.length) return

	let current = 0

	const setCurrent = (index) => {
		current = index
		videos.forEach((video, i) => video.classList.toggle("active", i === index))
		dots.forEach((dot, i) => dot.classList.toggle("active", i === index))
	}

	dots.forEach((dot, idx) => {
		dot.addEventListener("click", () => {
			setCurrent(idx)
			if (videoIntervalId) clearInterval(videoIntervalId)
			startAutoCycle()
		})
	})

	const startAutoCycle = () => {
		videoIntervalId = setInterval(() => {
			const next = (current + 1) % videos.length
			setCurrent(next)
		}, 6200)
	}

	setCurrent(0)
	startAutoCycle()
}

const initParallax = () => {
	const hero = document.querySelector(".hero")
	if (!hero) return

	const heroBg = hero.querySelector(".hero-bg")
	const heroAccent = hero.querySelector(".hero-accent")
	const heroContent = hero.querySelector(".hero-content")

	const animatedSections = [
		...document.querySelectorAll(".credibility, .services, .testimonials, .contact"),
	]

	const update = () => {
		const viewportH = window.innerHeight
		const heroRect = hero.getBoundingClientRect()
		const heroProgress = Math.max(-0.3, Math.min(1.4, (viewportH - heroRect.top) / (viewportH + heroRect.height)))

		const bgY = heroProgress * 38
		const accentY = heroProgress * 58
		const contentY = heroProgress * -16

		if (heroBg) heroBg.style.transform = `translate3d(0, ${bgY}px, 0) scale(1.05)`
		if (heroAccent) heroAccent.style.transform = `translate3d(0, ${accentY}px, 0)`
		if (heroContent) heroContent.style.transform = `translate3d(0, ${contentY}px, 0)`

		animatedSections.forEach((section) => {
			const rect = section.getBoundingClientRect()
			if (rect.bottom < 0 || rect.top > viewportH) return
			const ratio = (viewportH - rect.top) / (viewportH + rect.height)
			const y = (ratio - 0.5) * 16
			section.style.transform = `translate3d(0, ${y}px, 0)`
		})

		parallaxRafId = null
	}

	const requestUpdate = () => {
		if (parallaxRafId !== null) return
		parallaxRafId = requestAnimationFrame(update)
	}

	update()
	window.addEventListener("scroll", requestUpdate, { passive: true })
	window.addEventListener("resize", requestUpdate)
}

window.handleForm = (event) => {
	event.preventDefault()
	const button = document.getElementById("submitBtn")
	if (!button) return

	const previous = button.textContent
	button.disabled = true
	button.textContent = "Envoyé ✓"

	setTimeout(() => {
		button.disabled = false
		button.textContent = previous
		event.target.reset()
	}, 1400)
}

const initHomePage = () => {
	if (!document.querySelector(".hero")) return
	applyRevealObserver()
	initCursor()
	initNavbarOnScroll()
	initHeroVideos()
	initParallax()
}

document.addEventListener("turbo:load", initHomePage)
document.addEventListener("DOMContentLoaded", initHomePage)
window.addEventListener("load", initHomePage)

if (document.readyState === "interactive" || document.readyState === "complete") {
	initHomePage()
}

document.addEventListener("turbo:before-cache", () => {
	if (videoIntervalId) {
		clearInterval(videoIntervalId)
		videoIntervalId = null
	}
	if (parallaxRafId) {
		cancelAnimationFrame(parallaxRafId)
		parallaxRafId = null
	}
})
