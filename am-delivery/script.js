const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Formulário de solicitação de acesso — envio via Formspree
const accessForm = document.getElementById('accessForm');
const afSuccess = document.getElementById('afSuccess');
const afError = document.getElementById('afError');

if(accessForm){
  accessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    afError.classList.remove('show');

    if(!accessForm.checkValidity()){
      accessForm.reportValidity();
      return;
    }

    const submitBtn = accessForm.querySelector('.af-submit');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch(accessForm.action, {
        method: 'POST',
        body: new FormData(accessForm),
        headers: { 'Accept': 'application/json' }
      });

      if(response.ok){
        afSuccess.classList.add('show');
        accessForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
        afSuccess.scrollIntoView({behavior:'smooth', block:'center'});
      } else {
        throw new Error('Falha no envio');
      }
    } catch(err){
      afError.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      afError.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });
}

// Modal de Termos de Uso
const termosModal = document.getElementById('termosModal');
const openTermos = document.getElementById('openTermos');
const openTermosFooter = document.getElementById('openTermosFooter');
const closeTermos = document.getElementById('closeTermos');

function showTermos(e){
  e.preventDefault();
  termosModal.classList.add('show');
}
function hideTermos(){
  termosModal.classList.remove('show');
}

if(openTermos) openTermos.addEventListener('click', showTermos);
if(openTermosFooter) openTermosFooter.addEventListener('click', showTermos);
if(closeTermos) closeTermos.addEventListener('click', hideTermos);
if(termosModal){
  termosModal.addEventListener('click', (e) => {
    if(e.target === termosModal) hideTermos();
  });
}
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && termosModal && termosModal.classList.contains('show')) hideTermos();
});
