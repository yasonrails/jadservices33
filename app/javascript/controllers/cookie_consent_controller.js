import { Controller } from "@hotwired/stimulus"

const STORAGE_KEY = "cookie_consent"

export default class extends Controller {
  static targets = ["overlay", "modal"]

  connect() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Next frame so CSS transition fires on initial load
      requestAnimationFrame(() => {
        this.overlayTarget.classList.add("cookie-overlay--visible")
      })
    }
  }

  accept() {
    localStorage.setItem(STORAGE_KEY, "accepted")
    this._hide()
  }

  decline() {
    localStorage.setItem(STORAGE_KEY, "declined")
    this._hide()
  }

  _hide() {
    this.overlayTarget.classList.add("cookie-overlay--hiding")
    this.overlayTarget.addEventListener("animationend", () => {
      this.overlayTarget.classList.remove(
        "cookie-overlay--visible",
        "cookie-overlay--hiding"
      )
    }, { once: true })
  }
}
