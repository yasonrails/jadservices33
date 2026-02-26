document.documentElement.classList.add("js-enabled");

let videoTimer = null;
let cleanupHandlers = [];
let cursorAnimationId = null;

const registerCleanup = (handler) => {
  cleanupHandlers.push(handler);
};

const cleanupHomePage = () => {
  if (videoTimer) {
    clearInterval(videoTimer);
    videoTimer = null;
  }

  if (cursorAnimationId) {
    cancelAnimationFrame(cursorAnimationId);
    cursorAnimationId = null;
  }

  cleanupHandlers.forEach((handler) => handler());
  cleanupHandlers = [];
};

const bindEvent = (target, eventName, handler, options) => {
  target.addEventListener(eventName, handler, options);
  registerCleanup(() => target.removeEventListener(eventName, handler, options));
};

const initCustomCursor = () => {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring") || document.getElementById("cursorRing");
  if (!cursor || !ring) return;

  if (window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = "none";
    ring.style.display = "none";
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  const onMouseMove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  };

  bindEvent(document, "mousemove", onMouseMove, { passive: true });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    cursorAnimationId = requestAnimationFrame(animateRing);
  };

  animateRing();

  document.querySelectorAll("a, button, input, select, textarea, .service-card, .testi-card").forEach((element) => {
    const onEnter = () => ring.classList.add("hov");
    const onLeave = () => ring.classList.remove("hov");
    bindEvent(element, "mouseenter", onEnter);
    bindEvent(element, "mouseleave", onLeave);
  });
};

const initNavbar = () => {
  const nav = document.getElementById("navbar") || document.querySelector("nav");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 52);
  };

  onScroll();
  bindEvent(window, "scroll", onScroll, { passive: true });
};

const initVideoCarousel = () => {
  const videos = Array.from(document.querySelectorAll(".hero-video"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  if (videos.length === 0) return;

  let currentIndex = Math.max(videos.findIndex((video) => video.classList.contains("active")), 0);

  const activateVideo = (nextIndex) => {
    if (!videos[nextIndex]) return;

    videos[currentIndex]?.classList.remove("active");
    dots[currentIndex]?.classList.remove("active");
    videos[currentIndex]?.pause();

    currentIndex = nextIndex;
    videos[currentIndex].classList.add("active");
    dots[currentIndex]?.classList.add("active");

    const currentVideo = videos[currentIndex];
    if (currentVideo.readyState === 0) currentVideo.load();
    currentVideo.play().catch(() => {});
  };

  const restartAutoplay = () => {
    if (videoTimer) clearInterval(videoTimer);
    if (videos.length <= 1) return;
    videoTimer = setInterval(() => {
      activateVideo((currentIndex + 1) % videos.length);
    }, 5800);
  };

  dots.forEach((dot, dotIndex) => {
    bindEvent(dot, "click", () => {
      activateVideo(dotIndex);
      restartAutoplay();
    });
  });

  activateVideo(currentIndex);
  restartAutoplay();
};

const initHeroParallax = () => {
  const hero = document.querySelector(".hero");
  const content = document.querySelector("[data-parallax]");
  if (!hero || !content) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;

  const updateParallax = () => {
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom <= 0) {
      content.style.transform = "";
      ticking = false;
      return;
    }

    const offset = Math.min(window.scrollY * 0.14, 64);
    content.style.transform = `translate3d(0, ${offset}px, 0)`;
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  };

  bindEvent(window, "scroll", onScroll, { passive: true });
  updateParallax();
  registerCleanup(() => {
    content.style.transform = "";
  });
};

const initRevealAnimations = () => {
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
  registerCleanup(() => revealObserver.disconnect());
};

const initContactForm = () => {
  const form = document.getElementById("contactForm");
  const submitButton = document.getElementById("submitBtn");
  if (!form || !submitButton) return;

  const onSubmit = (event) => {
    event.preventDefault();

    submitButton.textContent = "Demande envoyée";
    submitButton.disabled = true;
    submitButton.style.background = "#244334";

    window.setTimeout(() => {
      submitButton.textContent = "Envoyer la demande";
      submitButton.disabled = false;
      submitButton.style.background = "";
      form.reset();
    }, 2600);
  };

  bindEvent(form, "submit", onSubmit);
};

const initHomePage = () => {
  if (!document.querySelector(".hero")) return;

  cleanupHomePage();
  initCustomCursor();
  initNavbar();
  initVideoCarousel();
  initHeroParallax();
  initRevealAnimations();
  initContactForm();
};

document.addEventListener("turbo:load", initHomePage);
document.addEventListener("DOMContentLoaded", initHomePage);
document.addEventListener("turbo:before-cache", cleanupHomePage);

if (document.readyState !== "loading") initHomePage();
