export const initCursor = () => {
  if (window.matchMedia("(hover: none)").matches) return () => {}

  const cursor = document.getElementById("cursor")
  const ring = document.getElementById("cursor-ring")
  if (!cursor || !ring) return () => {}

  const onMouseMove = (event) => {
    cursor.style.left = `${event.clientX}px`
    cursor.style.top = `${event.clientY}px`
    ring.style.left = `${event.clientX}px`
    ring.style.top = `${event.clientY}px`
  }

  const interactiveNodes = document.querySelectorAll("a, button, .service-card, .testi-card")

  const onEnter = () => ring.classList.add("hov")
  const onLeave = () => ring.classList.remove("hov")

  document.addEventListener("mousemove", onMouseMove)
  interactiveNodes.forEach((node) => {
    node.addEventListener("mouseenter", onEnter)
    node.addEventListener("mouseleave", onLeave)
  })

  return () => {
    document.removeEventListener("mousemove", onMouseMove)
    interactiveNodes.forEach((node) => {
      node.removeEventListener("mouseenter", onEnter)
      node.removeEventListener("mouseleave", onLeave)
    })
  }
}
