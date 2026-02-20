// Premium home page JS: custom cursor, nav scroll, reveal, parallax, band counter, form feedback, smooth scroll
document.addEventListener("DOMContentLoaded", function () {
  // CUSTOM CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  if (cursor && ring) {
    document.body.style.cursor = 'none';
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    });
    const interactives = document.querySelectorAll('a, button, .service-card, .testi-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
    (function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(animateRing);
    })();
  }

  // NAVBAR SCROLL EFFECT
  const navbar = document.querySelector('nav, #navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // SCROLL REVEAL (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal');
  if (window.IntersectionObserver && reveals.length > 0) {
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // PARALLAX HERO
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    const accent = document.querySelector('.hero-accent');
    const sy = window.scrollY;
    if (hero) hero.style.transform = `translateY(${sy * 0.3}px)`;
    if (accent) accent.style.transform = `translateY(calc(-50% + ${sy * 0.15}px))`;
  });

  // BAND NUMBER COUNTER
  const bandItems = document.querySelectorAll('.band-item');
  if (window.IntersectionObserver && bandItems.length > 0) {
    const bandObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = true;
          const num = entry.target.querySelector('.band-num');
          const text = num.textContent;
          const val = parseInt(text);
          const hasPct = text.includes('%');
          const hasPlus = text.includes('+');
          num.innerHTML = '0' + (hasPlus ? '<span>+</span>' : hasPct ? '<span>%</span>' : '');
          let cur = 0;
          const step = val / 40;
          const t = setInterval(() => {
            cur = Math.min(cur + step, val);
            num.childNodes[0].textContent = Math.round(cur);
            if (cur >= val) clearInterval(t);
          }, 30);
        }
      });
    }, { threshold: 0.5 });
    bandItems.forEach(el => bandObserver.observe(el));
  }

  // FORM FEEDBACK
  window.handleSubmit = function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    btn.textContent = 'Message envoyé ✓';
    btn.style.background = '#2D5240';
    setTimeout(() => {
      btn.textContent = 'Envoyer la demande';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  }

  // SMOOTH SCROLL FOR ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
