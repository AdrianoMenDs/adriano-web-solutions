// ── CURSOR ──────────────────────────────────────────────
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .service-card, .proj-card, .channel-link').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  // ── REVEAL AO ROLAR ─────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.service-card, .proj-card, .process-step, .channel-link, .counter-item, .section-title, .section-sub, .section-tag'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    if (i % 4 === 2) el.classList.add('reveal-delay-2');
    if (i % 4 === 3) el.classList.add('reveal-delay-3');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // ── CONTADOR ANIMADO ─────────────────────────────────────
  function animateCounter(el, target, suffix, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  }

  const counters = [
    { selector: '.counter-num:nth-child(1)', target: 15, suffix: '+' },
  ];

  const counterEls = document.querySelectorAll('.counter-num');
  const counterData = [
    { target: 15, suffix: '+' },
    { target: 7, suffix: 'd' },
    { target: 100, suffix: '%' },
  ];



  // ── PARALLAX BG TEXT ─────────────────────────────────────
  const bgText = document.querySelector('.hero-bg-text');
  if (bgText) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      bgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
    });
  }