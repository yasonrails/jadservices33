// app/javascript/home.js
// JAD Services 33 — Toutes les interactions
// À importer dans application.js : import "./home"

document.addEventListener("DOMContentLoaded", function () {

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
        startCarousel();
      });
    });

    startCarousel();
  }


  // ═══════════════════════════════════════════════
  //  CURSOR PERSONNALISÉ
  // ═══════════════════════════════════════════════
  const cur  = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (window.matchMedia("(hover: none)").matches) {
    if (cur)  cur.style.display  = "none";
    if (ring) ring.style.display = "none";
    document.body.style.cursor = "auto";
  } else {
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cur) cur.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    }, { passive: true });

    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll("a, button, .service-card, .testi-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring?.classList.add("hov"));
      el.addEventListener("mouseleave", () => ring?.classList.remove("hov"));
    });
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
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));


  // ═══════════════════════════════════════════════
  //  COMPTEURS ANIMÉS
  // ═══════════════════════════════════════════════
  const counterDefs = [
    { id: "c1", target: 20  },
    { id: "c2", target: 2   },
    { id: "c3", target: 6   },
    { id: "c4", target: 100 },
  ];

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = "1";

      const def = counterDefs.find((c) => c.id === e.target.id);
      if (!def) return;

      let n = 0;
      const step = def.target / 40;
      const timer = setInterval(() => {
        n = Math.min(n + step, def.target);
        e.target.textContent = Math.round(n);
        if (n >= def.target) clearInterval(timer);
      }, 30);
    });
  }, { threshold: 0.5 });

  ["c1", "c2", "c3", "c4"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) counterObserver.observe(el);
  });


  // ═══════════════════════════════════════════════
  //  FORMULAIRE CONTACT
  // ═══════════════════════════════════════════════
  window.handleForm = function (e) {
    e.preventDefault();
    const btn  = document.getElementById("submitBtn");
    const orig = btn.textContent;

    btn.textContent = "Message envoyé ✓";
    btn.style.background = "#2D5240";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent     = orig;
      btn.style.background = "";
      btn.disabled         = false;
      e.target.reset();
    }, 3000);
  };

});