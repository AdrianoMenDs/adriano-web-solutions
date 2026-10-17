const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((element) => io.observe(element));

/* ===== Expansão dos recursos ===== */
const featuresToggle = document.getElementById('featuresToggle');
const moreFeatures = document.getElementById('moreFeatures');

if (featuresToggle && moreFeatures) {
  featuresToggle.addEventListener('click', () => {
    const willOpen = featuresToggle.getAttribute('aria-expanded') !== 'true';
    featuresToggle.setAttribute('aria-expanded', String(willOpen));
    moreFeatures.hidden = !willOpen;
    featuresToggle.querySelector('span').textContent = willOpen
      ? 'Mostrar menos recursos'
      : 'Conhecer todos os recursos';

    if (willOpen) {
      moreFeatures.classList.remove('is-opening');
      void moreFeatures.offsetWidth;
      moreFeatures.classList.add('is-opening');
    }
  });
}
