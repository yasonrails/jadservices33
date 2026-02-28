export const initParallax = () => {
  const hero = document.querySelector(".hero")
  if (!hero) return () => {}

  const heroBg = hero.querySelector(".hero-bg")
  const heroAccent = hero.querySelector(".hero-accent")
  const heroContent = hero.querySelector(".hero-content")
  const animatedSections = document.querySelectorAll(".credibility, .services, .testimonials, .contact")

  let rafId = null

  const update = () => {
    const viewportHeight = window.innerHeight
    const heroRect = hero.getBoundingClientRect()
    const heroProgress = Math.max(-0.3, Math.min(1.4, (viewportHeight - heroRect.top) / (viewportHeight + heroRect.height)))

    const bgY = heroProgress * 38
    const accentY = heroProgress * 58
    const contentY = heroProgress * -16

    if (heroBg) heroBg.style.transform = `translate3d(0, ${bgY}px, 0) scale(1.05)`
    if (heroAccent) heroAccent.style.transform = `translate3d(0, ${accentY}px, 0)`
    if (heroContent) heroContent.style.transform = `translate3d(0, ${contentY}px, 0)`

    animatedSections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > viewportHeight) return

      const ratio = (viewportHeight - rect.top) / (viewportHeight + rect.height)
      const y = (ratio - 0.5) * 16
      section.style.transform = `translate3d(0, ${y}px, 0)`
    })

    rafId = null
  }

  const requestUpdate = () => {
    if (rafId !== null) return
    rafId = requestAnimationFrame(update)
  }

  update()
  window.addEventListener("scroll", requestUpdate, { passive: true })
  window.addEventListener("resize", requestUpdate)

  return () => {
    window.removeEventListener("scroll", requestUpdate)
    window.removeEventListener("resize", requestUpdate)
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
}
