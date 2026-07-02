/* =============================================
   COORE ORGANICS — JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      setTimeout(() => { loader.classList.add('hidden'); }, 200);
    }
    progress.style.width = pct + '%';
  }, 80);

  // ===== CURSOR (desktop only) =====
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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

  // ===== SCROLL PROGRESS BAR =====
  const scrollBar = document.getElementById('scrollProgress');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollBar.style.width = pct + '%';
    }, { passive: true });
  }

  // ===== NAVBAR =====
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  function openMenu() {
    navLinks.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }

  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ===== COUNTER ANIMATION =====
  function animateCounter(el, target, duration = 2000) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      el.textContent = Math.round(eased * target);
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ===== INTERSECTION OBSERVER FACTORY =====
  const makeObserver = (callback, opts = {}) =>
    new IntersectionObserver(callback, { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...opts });

  // Stat counters
  const statObserver = makeObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (!isNaN(target)) animateCounter(el, target, 1800);
        statObserver.unobserve(el);
      }
    });
  });
  document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));

  // Reveal images
  const imgObserver = makeObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        imgObserver.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll('.reveal-img').forEach(el => imgObserver.observe(el));

  // Generic staggered reveal (pillar-item, process-card, herb-card)
  const staggerObserver = makeObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        staggerObserver.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll('.pillar-item, .process-card, .herb-card').forEach(el => staggerObserver.observe(el));

  // Data-reveal generic sections (commitment items, testimonials)
  const revealObserver = makeObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.revealDelay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  // Herb progress bars — animate when herb card becomes visible
  const progressObserver = makeObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.herb-progress-bar');
        if (bar) {
          const target = bar.dataset.progress || 0;
          setTimeout(() => { bar.style.width = target + '%'; }, 400);
        }
        progressObserver.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll('.herb-card').forEach(el => progressObserver.observe(el));

  // ===== PROCESS CARD ACTIVE STATE =====
  document.querySelectorAll('.process-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.process-card').forEach(c => c.classList.remove('process-card--active'));
      card.classList.add('process-card--active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('process-card--active');
    });
  });

  // ===== PARALLAX ON HERO (desktop only) =====
  if (window.matchMedia('(min-width: 1025px)').matches) {
    window.addEventListener('scroll', () => {
      const tower = document.getElementById('heroTower');
      if (tower) tower.style.transform = `translateY(${window.scrollY * 0.04}px)`;
    }, { passive: true });
  }

  // ===== CTA FORM =====
  const ctaSubmit = document.getElementById('ctaSubmit');
  const ctaEmail  = document.getElementById('ctaEmail');

  if (ctaSubmit && ctaEmail) {
    ctaSubmit.addEventListener('click', () => {
      const email = ctaEmail.value.trim();
      if (!email || !email.includes('@')) {
        ctaEmail.style.borderColor = 'rgba(255,120,120,0.8)';
        ctaEmail.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          ctaEmail.style.borderColor = '';
          ctaEmail.style.animation = '';
        }, 500);
        return;
      }
      ctaSubmit.textContent = '🌱 Registered!';
      ctaSubmit.disabled = true;
      ctaEmail.value = '';
      ctaSubmit.style.background = 'rgba(78,122,52,0.9)';
      setTimeout(() => {
        ctaSubmit.textContent = 'Get Started';
        ctaSubmit.disabled = false;
        ctaSubmit.style.background = '';
      }, 4000);
    });
  }

  // ===== SMOOTH ACTIVE NAV ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--green-dark)';
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

  // ===== HARVEST BADGE ROTATE =====
  const badges = ['Basil · Day 21', 'Lettuce · Day 14', 'Mint · Day 10', 'Spinach · Day 19'];
  let badgeIndex = 0;

  // Rotate on desktop hero badge
  const hbValue = document.querySelector('.hb-value');
  if (hbValue) {
    setInterval(() => {
      badgeIndex = (badgeIndex + 1) % badges.length;
      hbValue.style.opacity = '0';
      hbValue.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        hbValue.textContent = badges[badgeIndex];
        hbValue.style.transition = 'opacity 0.4s, transform 0.4s';
        hbValue.style.opacity = '1';
        hbValue.style.transform = '';
      }, 300);
    }, 2800);
  }

  // Rotate on mobile hero badge
  const hbValueMobile = document.querySelector('.hb-value-mobile');
  if (hbValueMobile) {
    setInterval(() => {
      badgeIndex = (badgeIndex + 1) % badges.length;
      hbValueMobile.style.opacity = '0';
      setTimeout(() => {
        hbValueMobile.textContent = badges[badgeIndex];
        hbValueMobile.style.transition = 'opacity 0.4s';
        hbValueMobile.style.opacity = '1';
      }, 300);
    }, 3200);
  }

  // ===== INJECT KEYFRAMES =====
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      25%{transform:translateX(-8px)}
      75%{transform:translateX(8px)}
    }
  `;
  document.head.appendChild(styleSheet);

  console.log('%c🌿 Coore Organics — Fresh | Pure | Affordable', 'color: #2d4a1e; font-size:14px; font-weight:bold;');
});
