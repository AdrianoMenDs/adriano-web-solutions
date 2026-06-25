const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ====== SCROLL REVEAL ======
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 80);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));

// ====== MONITOR CAROUSEL ======
let monitorIdx = 0;
const monitorTrack = document.getElementById("monitorCarousel");
const monitorSlides = monitorTrack.querySelectorAll(".monitor-slide");
function advanceMonitor() {
  monitorIdx = (monitorIdx + 1) % monitorSlides.length;
  monitorTrack.style.transform = `translateX(-${monitorIdx * 100}%)`;
}
setInterval(advanceMonitor, 3500);

// ====== NOTEBOOK CAROUSEL ======
let nbIdx = 0;
const nbTrack = document.getElementById("nbCarousel");
function setNbSlide(idx) {
  nbIdx = idx;
  nbTrack.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll(".gallery-feat-card").forEach((c, i) => {
    c.classList.toggle("active-feat", i === idx);
  });
}
setInterval(() => setNbSlide((nbIdx + 1) % 2), 4000);

// ====== THEMES 3D SLIDER ======
const themeData = [
  { id: "theme0" },
  { id: "theme1" },
  { id: "theme2" },
  { id: "theme3" },
];
let currentTheme = 1;
const totalThemes = themeData.length;

function getThemeClass(cardIdx, current) {
  const total = totalThemes;
  const diff = (cardIdx - current + total) % total;
  if (diff === 0) return "active";
  if (diff === 1) return "next";
  if (diff === total - 1) return "prev";
  if (diff === 2) return "hidden-right";
  return "hidden-left";
}

function updateThemeSlider() {
  themeData.forEach((t, i) => {
    const el = document.getElementById(t.id);
    el.className = "theme-card-3d " + getThemeClass(i, currentTheme);
  });
  document.querySelectorAll(".theme-dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentTheme);
  });
}

document.getElementById("themeNext").addEventListener("click", () => {
  currentTheme = (currentTheme + 1) % totalThemes;
  updateThemeSlider();
});

document.getElementById("themePrev").addEventListener("click", () => {
  currentTheme = (currentTheme - 1 + totalThemes) % totalThemes;
  updateThemeSlider();
});

document.querySelectorAll(".theme-dot").forEach(d => {
  d.addEventListener("click", () => {
    currentTheme = parseInt(d.dataset.idx);
    updateThemeSlider();
  });
});

// Click on side cards to navigate
document.querySelectorAll(".theme-card-3d").forEach((card, i) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("prev") || card.classList.contains("next") ||
        card.classList.contains("hidden-left") || card.classList.contains("hidden-right")) {
      currentTheme = i;
      updateThemeSlider();
    }
  });
});

updateThemeSlider();

// Auto-advance themes
setInterval(() => {
  currentTheme = (currentTheme + 1) % totalThemes;
  updateThemeSlider();
}, 5000);

// ====== PARALLAX HERO GLOW ======
window.addEventListener("mousemove", (e) => {
  const glow = document.querySelector(".hero-bg-glow");
  if (!glow) return;
  const x = (e.clientX / window.innerWidth) * 100 - 50;
  const y = (e.clientY / window.innerHeight) * 100 - 50;
  glow.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});
