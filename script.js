/* =========================================================================
   MUHAMMAD HASSAN — PORTFOLIO SCRIPT
   Handles: theme toggle, mobile nav, navbar scroll state, typed terminal
   effect, scroll-reveal animations, animated skill bars, active nav link,
   back-to-top button, and footer year.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. THEME TOGGLE (Dark / Light) — persisted in localStorage
  --------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const STORAGE_KEY = 'hassan-portfolio-theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  // Respect saved preference, otherwise fall back to system preference
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------------------------------------------------------------------
     2. MOBILE NAVIGATION (Hamburger menu)
  --------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after clicking a nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------------------------------------------------------------------
     3. NAVBAR SCROLLED STATE + BACK TO TOP BUTTON
  --------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function handleScrollUI() {
    const scrolled = window.scrollY > 30;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', handleScrollUI, { passive: true });
  handleScrollUI();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL (IntersectionObserver)
  --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkMap = new Map();
  document.querySelectorAll('.nav-link').forEach(link => {
    navLinkMap.set(link.dataset.section, link);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = navLinkMap.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  /* ---------------------------------------------------------------------
     5. TYPED TERMINAL EFFECT (hero signature element)
  --------------------------------------------------------------------- */
  const typedTextEl = document.getElementById('typedText');
  const linesToType = [
    "whoami",
    "Muhammad Hassan — CS Student & Software Developer",
    "echo $PASSION",
    "Building clean, efficient, real-world software."
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedTextEl) return;
    const currentLine = linesToType[lineIndex];

    if (!deleting) {
      typedTextEl.textContent = currentLine.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentLine.length) {
        deleting = true;
        setTimeout(typeLoop, 1500); // pause at full line
        return;
      }
    } else {
      typedTextEl.textContent = currentLine.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % linesToType.length;
      }
    }

    const speed = deleting ? 28 : 55;
    setTimeout(typeLoop, speed);
  }

  // Respect reduced-motion preference: show static text instead of animating
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typedTextEl) {
    if (prefersReducedMotion) {
      typedTextEl.textContent = linesToType[1];
    } else {
      typeLoop();
    }
  }

  /* ---------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
  --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.about-text, .about-card, .skill-card, .project-card, .timeline-item, ' +
    '.contact-card, .cv-box, .section-title, .section-subtitle'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // slight stagger for grouped items (cards)
        const delay = (entry.target.dataset.staggerIndex || 0) * 60;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Apply stagger index within each grid/group for a nicer cascading effect
  function staggerGroup(selector) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.staggerIndex = i;
    });
  }
  staggerGroup('.skill-card');
  staggerGroup('.project-card');
  staggerGroup('.contact-card');

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     7. ANIMATED SKILL PROGRESS BARS (fill on scroll into view)
  --------------------------------------------------------------------- */
  const progressFills = document.querySelectorAll('.progress-fill');

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const value = fill.dataset.progress || 0;
        fill.style.width = value + '%';
        progressObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  progressFills.forEach(fill => progressObserver.observe(fill));

  /* ---------------------------------------------------------------------
     8. CURSOR GLOW (desktop only — purely decorative ambient effect)
  --------------------------------------------------------------------- */
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     9. FOOTER — CURRENT YEAR
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     10. CV DOWNLOAD BUTTON
     Note: replace the href on #downloadCvBtn in index.html with the real
     path to your CV file (e.g. "assets/Muhammad-Hassan-CV.pdf") for this
     to download an actual file. Currently shows a friendly notice if no
     file has been wired up yet.
  --------------------------------------------------------------------- */
  const cvBtn = document.getElementById('downloadCvBtn');
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      const href = cvBtn.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        alert('Add your CV file path to the "downloadCvBtn" link in index.html to enable this download.');
      }
    });
  }

});
