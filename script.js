/* =============================================
   COORE ORGANICS — JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  const loader   = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      setTimeout(() => loader.classList.add('hidden'), 200);
    }
    progress.style.width = pct + '%';
  }, 80);

  // ===== CUSTOM CURSOR (mouse/desktop only) =====
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (cursor && follower) {
      let mx = 0, my = 0, fx = 0, fy = 0;
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
      });
      function animateFollower() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.left = fx + 'px';
        follower.style.top  = fy + 'px';
        requestAnimationFrame(animateFollower);
      }
      animateFollower();
    }
  }

  // ===== SCROLL PROGRESS BAR =====
  const scrollBar = document.getElementById('scrollProgress');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
    }, { passive: true });
  }

  // ===== NAVBAR SCROLL STYLE =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ===== MOBILE MENU =====
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navOverlay = document.getElementById('navOverlay');

  function openMenu() {
    mobileMenu.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    navToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  navToggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  navOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenu));

  // ===== COUNTER ANIMATION =====
  function animateCounter(el, target, duration = 1800) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round((1 - Math.pow(1 - pct, 3)) * target);
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ===== INTERSECTION OBSERVER FACTORY =====
  const makeObs = (cb, opts = {}) =>
    new IntersectionObserver(cb, { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...opts });

  // Counters
  const statObs = makeObs(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const t = parseInt(e.target.dataset.target);
      if (!isNaN(t)) animateCounter(e.target, t);
      statObs.unobserve(e.target);
    }
  }));
  document.querySelectorAll('[data-target]').forEach(el => statObs.observe(el));

  // Reveal images
  const imgObs = makeObs(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); imgObs.unobserve(e.target); }
  }));
  document.querySelectorAll('.reveal-img').forEach(el => imgObs.observe(el));

  // Staggered items (pillar, process card, herb card)
  const staggerObs = makeObs(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), parseInt(e.target.dataset.delay || 0));
      staggerObs.unobserve(e.target);
    }
  }));
  document.querySelectorAll('.pillar-item, .process-card, .herb-card').forEach(el => staggerObs.observe(el));

  // Data-reveal (commitment strip, testimonials)
  const revealObs = makeObs(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), parseInt(e.target.dataset.revealDelay || 0));
      revealObs.unobserve(e.target);
    }
  }));
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  // Herb progress bars
  const progressObs = makeObs(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      const bar = e.target.querySelector('.herb-progress-bar');
      if (bar) setTimeout(() => { bar.style.width = (bar.dataset.progress || 0) + '%'; }, 400);
      progressObs.unobserve(e.target);
    }
  }));
  document.querySelectorAll('.herb-card').forEach(el => progressObs.observe(el));

  // ===== PROCESS CARD HOVER ACTIVE =====
  document.querySelectorAll('.process-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.process-card').forEach(c => c.classList.remove('process-card--active'));
      card.classList.add('process-card--active');
    });
    card.addEventListener('mouseleave', () => card.classList.remove('process-card--active'));
  });

  // ===== PARALLAX (desktop only) =====
  if (window.matchMedia('(min-width: 1025px)').matches) {
    window.addEventListener('scroll', () => {
      const tower = document.getElementById('heroTower');
      if (tower) tower.style.transform = `translateY(${window.scrollY * 0.04}px)`;
    }, { passive: true });
  }

  // ===== ACTIVE NAV ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.style.color = '');
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.style.color = 'var(--green-dark)';
      }
    });
  }, { threshold: 0.5 }).observe && sections.forEach(s =>
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.style.color = '');
          const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if (a) a.style.color = 'var(--green-dark)';
        }
      });
    }, { threshold: 0.5 }).observe(s)
  );

  // ===== HARVEST BADGE ROTATE =====
  const badges  = ['Basil · Day 21', 'Lettuce · Day 14', 'Mint · Day 10', 'Spinach · Day 19'];
  let badgeIdx  = 0;
  const hbValue = document.querySelector('.hb-value');
  if (hbValue) {
    setInterval(() => {
      badgeIdx = (badgeIdx + 1) % badges.length;
      hbValue.style.opacity = '0';
      hbValue.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        hbValue.textContent = badges[badgeIdx];
        hbValue.style.transition = 'opacity 0.4s, transform 0.4s';
        hbValue.style.opacity = '1';
        hbValue.style.transform = '';
      }, 300);
    }, 2800);
  }

  // ===== CTA FORM =====
  const ctaSubmit = document.getElementById('ctaSubmit');
  const ctaEmail  = document.getElementById('ctaEmail');
  if (ctaSubmit && ctaEmail) {
    ctaSubmit.addEventListener('click', () => {
      const email = ctaEmail.value.trim();
      if (!email || !email.includes('@')) {
        ctaEmail.style.borderColor = 'rgba(255,120,120,0.8)';
        setTimeout(() => { ctaEmail.style.borderColor = ''; }, 600);
        return;
      }
      ctaSubmit.textContent = '🌱 Registered!';
      ctaSubmit.disabled = true;
      ctaEmail.value = '';
      setTimeout(() => {
        ctaSubmit.textContent = 'Get Started';
        ctaSubmit.disabled = false;
      }, 4000);
    });
  }

  console.log('%c🌿 Coore Organics — Fresh | Pure | Affordable', 'color:#2d4a1e;font-size:14px;font-weight:bold;');
});
