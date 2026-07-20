const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ===== Solicitação de acesso — AM Delivery ===== */
const accessForm = document.getElementById('accessForm');
const afSuccess  = document.getElementById('afSuccess');
const afError    = document.getElementById('afError');

if(accessForm){
  const empresa    = document.getElementById('af-empresa');
  const slug       = document.getElementById('af-slug');
  const hintStrong = accessForm.querySelector('.af-hint strong');
  const subject    = accessForm.querySelector('input[name="_subject"]');

  /* ---- Slug: normaliza e sugere a partir do nome da empresa ---- */
  let slugEditado = false;

  function slugify(txt){
    return txt
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // tira acento
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // espaço/símbolo -> hífen
      .replace(/^-+|-+$/g, '');      // limpa hífens das pontas
  }
  function atualizarPreview(){
    if(hintStrong) hintStrong.textContent = `/delivery/${slug.value || 'seu-slug'}`;
  }
  empresa.addEventListener('input', () => {
    if(!slugEditado){ slug.value = slugify(empresa.value); atualizarPreview(); }
  });
  slug.addEventListener('input', () => {
    slugEditado = true;
    slug.value = slugify(slug.value);
    atualizarPreview();
  });

  /* ---- Envio via Formspree (AJAX, sem sair da página) ---- */
  accessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    afError.classList.remove('show');

    if(!accessForm.checkValidity()){
      accessForm.reportValidity();
      return;
    }

    // assunto do e-mail já com o nome da loja
    if(subject) subject.value = `Nova solicitação de acesso — ${empresa.value || 'AM Delivery'}`;

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

/* ===== Modal de Termos de Uso ===== */
const termosModal = document.getElementById('termosModal');
const openTermos = document.getElementById('openTermos');
const openTermosFooter = document.getElementById('openTermosFooter');
const closeTermos = document.getElementById('closeTermos');

function showTermos(e){ e.preventDefault(); termosModal.classList.add('show'); }
function hideTermos(){ termosModal.classList.remove('show'); }

if(openTermos) openTermos.addEventListener('click', showTermos);
if(openTermosFooter) openTermosFooter.addEventListener('click', showTermos);
if(closeTermos) closeTermos.addEventListener('click', hideTermos);
if(termosModal){
  termosModal.addEventListener('click', (e) => { if(e.target === termosModal) hideTermos(); });
}
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && termosModal && termosModal.classList.contains('show')) hideTermos();
});

/* ===== Solicitação de acesso — AM Delivery ===== */
(function () {
  const form = document.getElementById("accessForm");
  if (!form) return;

  const empresa    = document.getElementById("af-empresa");
  const slug       = document.getElementById("af-slug");
  const hintStrong = form.querySelector(".af-hint strong");
  const subject    = form.querySelector('input[name="_subject"]');
  const success    = document.getElementById("afSuccess");
  const error      = document.getElementById("afError");
  const submitBtn  = form.querySelector(".af-submit");

  /* ---- Slug: normaliza e sugere a partir do nome da empresa ---- */
  let slugEditado = false;

  function slugify(txt) {
    return txt
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // tira acento
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")  // espaço/símbolo -> hífen
      .replace(/^-+|-+$/g, "");      // limpa hífens das pontas
  }

  function atualizarPreview() {
    if (hintStrong) hintStrong.textContent = `/delivery/${slug.value || "seu-slug"}`;
  }

  empresa.addEventListener("input", () => {
    if (!slugEditado) { slug.value = slugify(empresa.value); atualizarPreview(); }
  });

  slug.addEventListener("input", () => {
    slugEditado = true;
    slug.value = slugify(slug.value);
    atualizarPreview();
  });

  /* ---- Envio via Formspree (AJAX, sem sair da página) ---- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    success.style.display = "none";
    error.style.display   = "none";

    // assunto do e-mail já com o nome da loja
    if (subject) subject.value = `Nova solicitação de acesso — ${empresa.value || "AM Delivery"}`;

    const textoBtn = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (res.ok) {
        form.reset();
        slugEditado = false;
        atualizarPreview();
        success.style.display = "block";
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        error.style.display = "block";
      }
    } catch {
      error.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = textoBtn;
    }
  });
})();