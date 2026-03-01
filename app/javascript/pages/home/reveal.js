const getGridColumnCount = (gridElement) => {
  const templateColumns = window.getComputedStyle(gridElement).gridTemplateColumns
  if (!templateColumns) return 1

  const columns = templateColumns
    .split(" ")
    .filter((value) => value && value !== "none").length

  return Math.max(1, columns)
}

const applyServiceGridStagger = () => {
  const serviceGrids = document.querySelectorAll(".services .services-grid")
  if (!serviceGrids.length) return

  serviceGrids.forEach((gridElement) => {
    const cards = gridElement.querySelectorAll(".service-card")
    const columnCount = getGridColumnCount(gridElement)

    cards.forEach((cardElement, index) => {
      const columnIndex = index % columnCount
      const delay = columnIndex * 0.03
      cardElement.style.setProperty("--card-delay", `${delay.toFixed(2)}s`)
    })
  })
}

export const initRevealObserver = () => {
  const items = document.querySelectorAll(".reveal")
  if (!items.length) return () => {}

  applyServiceGridStagger()

  let resizeFrame = null
  const handleResize = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => {
      applyServiceGridStagger()
      resizeFrame = null
    })
  }

  window.addEventListener("resize", handleResize, { passive: true })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.05, rootMargin: "0px 0px -10px 0px" }
  )

  items.forEach((item) => observer.observe(item))

  return () => {
    observer.disconnect()
    window.removeEventListener("resize", handleResize)
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
  }
}
