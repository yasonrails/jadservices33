export const registerFormHandler = () => {
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

  return () => {
    delete window.handleForm
  }
}
