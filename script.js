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

  // ===== CURSOR =====
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ===== COUNTER ANIMATION =====
  function animateCounter(el, target, duration = 2000, suffix = '') {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ===== INTERSECTION OBSERVER =====
  const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

  // Stat counters
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (!isNaN(target)) animateCounter(el, target, 1800);
        statObserver.unobserve(el);
      }
    });
  }, observerOpts);

  document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));

  // Reveal images
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        imgObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.reveal-img').forEach(el => imgObserver.observe(el));

  // Pillar items
  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        pillarObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.pillar-item').forEach(el => pillarObserver.observe(el));

  // Process cards stagger
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.process-card').forEach(el => cardObserver.observe(el));

  // Herb cards stagger
  const herbObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        herbObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.herb-card').forEach(el => herbObserver.observe(el));

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

  // ===== PARALLAX ON HERO =====
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const tower = document.getElementById('heroTower');
    if (tower) tower.style.transform = `translateY(${scrollY * 0.04}px)`;
  });

  // ===== CTA FORM =====
  const ctaSubmit = document.getElementById('ctaSubmit');
  const ctaEmail = document.getElementById('ctaEmail');

  if (ctaSubmit) {
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
  const links = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
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

  // ===== SHAKE KEYFRAME ===== (inject via JS)
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
