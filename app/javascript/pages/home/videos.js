export const initHeroVideos = () => {
  const videos = Array.from(document.querySelectorAll(".hero-video"))
  const dots = Array.from(document.querySelectorAll(".hero-dot"))
  if (!videos.length || !dots.length) return () => {}

  let current = 0
  let intervalId = null

  const setCurrent = (index) => {
    current = index
    videos.forEach((video, i) => video.classList.toggle("active", i === index))
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index))
  }

  const startAutoCycle = () => {
    if (intervalId) clearInterval(intervalId)
    intervalId = setInterval(() => {
      const next = (current + 1) % videos.length
      setCurrent(next)
    }, 6200)
  }

  const clickHandlers = dots.map((dot, idx) => {
    const onClick = () => {
      setCurrent(idx)
      startAutoCycle()
    }
    dot.addEventListener("click", onClick)
    return { dot, onClick }
  })

  setCurrent(0)
  startAutoCycle()

  return () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    clickHandlers.forEach(({ dot, onClick }) => dot.removeEventListener("click", onClick))
  }
}
