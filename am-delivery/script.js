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

/* ===== Modal de Termos de Uso ===== */
const termosModal = document.getElementById('termosModal');
const openTermos = document.getElementById('openTermos');
const openTermosFooter = document.getElementById('openTermosFooter');
const closeTermos = document.getElementById('closeTermos');

function showTermos(event) {
  event.preventDefault();
  termosModal.classList.add('show');
}

function hideTermos() {
  termosModal.classList.remove('show');
}

if (openTermos) openTermos.addEventListener('click', showTermos);
if (openTermosFooter) openTermosFooter.addEventListener('click', showTermos);
if (closeTermos) closeTermos.addEventListener('click', hideTermos);
if (termosModal) {
  termosModal.addEventListener('click', (event) => {
    if (event.target === termosModal) hideTermos();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && termosModal?.classList.contains('show')) hideTermos();
});
