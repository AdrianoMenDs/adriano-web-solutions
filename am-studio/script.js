const nav = document.getElementById('nav');
const setNav = () => nav.classList.toggle('scrolled', window.scrollY > 12);
setNav();
window.addEventListener('scroll', setNav, { passive:true });

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold:.12 });
revealItems.forEach((item) => observer.observe(item));
