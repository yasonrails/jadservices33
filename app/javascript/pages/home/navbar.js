export const initNavbarOnScroll = () => {
  const nav = document.getElementById("navbar")
  if (!nav) return () => {}

  const update = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20)
  }

  update()
  window.addEventListener("scroll", update)

  return () => {
    window.removeEventListener("scroll", update)
  }
}
