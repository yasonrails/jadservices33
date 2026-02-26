// app/javascript/home.js
// JAD Services 33 — Toutes les interactions
// À importer dans application.js : import "./home"

document.addEventListener("DOMContentLoaded", function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ═══════════════════════════════════════════════
  //  CAROUSEL VIDÉO
  //  Fonctionne avec video_tag Rails (src classique)
  // ═══════════════════════════════════════════════
  const videos = Array.from(document.querySelectorAll(".hero-video"));
  const dots   = Array.from(document.querySelectorAll(".hero-dot"));
  let current  = 0;
  let carousel;

  if (videos.length > 0) {

    function goTo(idx) {
      // Désactiver l'ancien
      videos[current].classList.remove("active");
      if (dots[current]) dots[current].classList.remove("active");

      current = (idx + videos.length) % videos.length;

      // Activer le nouveau
      videos[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");

      // Jouer la vidéo active (nécessaire sur certains navigateurs)
      const v = videos[current];
      if (v.readyState === 0) v.load();
      v.play().catch(() => {});
    }

    function startCarousel() {
      stopCarousel();
      carousel = setInterval(() => goTo(current + 1), 6000);
    }

    function stopCarousel() {
      clearInterval(carousel);
    }

    // Lancer la première vidéo
    videos[0].play().catch(() => {});

    // Dots cliquables
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopCarousel();
        goTo(i);
        if (!prefersReducedMotion) startCarousel();
      });
    });

    if (!prefersReducedMotion) startCarousel();
  }


  


  // ═══════════════════════════════════════════════
  //  NAVBAR — fond au scroll
  // ═══════════════════════════════════════════════
  const nav = document.getElementById("navbar");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });
  }


  // ═══════════════════════════════════════════════
  //  SCROLL REVEAL
  // ═══════════════════════════════════════════════
  const revealElements = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach((el) => revealObserver.observe(el));
  }


  // ═══════════════════════════════════════════════
  //  COMPTEURS ANIMÉS
  // ═══════════════════════════════════════════════
  const counterIds = ["c1", "c2", "c3", "c4"];
  const counterElements = counterIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target || "0", 10);
    if (!target) return;

    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }

    let n = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = Math.round(n);
      if (n >= target) clearInterval(timer);
    }, 30);
  }

  if (prefersReducedMotion) {
    counterElements.forEach((el) => animateCounter(el));
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || e.target.dataset.done) return;
        e.target.dataset.done = "1";
        animateCounter(e.target);
      });
    }, { threshold: 0.5 });

    counterElements.forEach((el) => counterObserver.observe(el));
  }


  // ═══════════════════════════════════════════════
  //  FORMULAIRE CONTACT
  // ═══════════════════════════════════════════════
  window.handleForm = function (e) {
    e.preventDefault();
    const form = e.target;
    const btn  = document.getElementById("submitBtn");
    const orig = btn ? btn.textContent : "";

    const data = new FormData(form);
    const nom = (data.get("nom") || "").toString().trim();
    const domaine = (data.get("domaine") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const telephone = (data.get("telephone") || "").toString().trim();
    const prestation = (data.get("prestation") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const subject = `Demande de devis viticole${nom ? ` - ${nom}` : ""}`;
    const body = [
      `Nom: ${nom || "-"}`,
      `Domaine: ${domaine || "-"}`,
      `Email: ${email || "-"}`,
      `Téléphone: ${telephone || "-"}`,
      `Prestation: ${prestation || "-"}`,
      "",
      "Message:",
      message || "-"
    ].join("\n");

    const mailto = `mailto:jadservice33@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (btn) {
      btn.textContent = "Ouverture email...";
      btn.style.background = "#2D5240";
      btn.disabled = true;
    }

    window.location.href = mailto;

    setTimeout(() => {
      if (btn) {
        btn.textContent = orig;
        btn.style.background = "";
        btn.disabled = false;
      }
      form.reset();
    }, 3000);
  };

});
