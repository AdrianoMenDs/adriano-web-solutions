  const wrap = document.getElementById('constellation');
  const cards = Array.from(document.querySelectorAll('.card'));
  const svg = document.getElementById('linesSvg');
  const hub = document.querySelector('.card.hub');
  const connectedSelectors = ['.card:nth-of-type(2)','.card:nth-of-type(3)','.card:nth-of-type(4)','.card:nth-of-type(5)','.card:nth-of-type(6)'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- navegação mobile ---- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainLinks = document.getElementById('mainLinks');
  if(menuToggle && mainLinks){
    const closeMenu = ()=>{
      mainLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      menuToggle.setAttribute('aria-label','Abrir menu');
    };
    menuToggle.addEventListener('click', ()=>{
      const isOpen = mainLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded',String(isOpen));
      menuToggle.setAttribute('aria-label',isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    mainLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
    document.addEventListener('keydown',(event)=>{ if(event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize',()=>{ if(window.innerWidth > 860) closeMenu(); });
  }

  if(wrap && svg){

  function position(){
    const rect = wrap.getBoundingClientRect();
    cards.forEach(c=>{
      const x = parseFloat(c.dataset.x)/100 * rect.width;
      const y = parseFloat(c.dataset.y)/100 * rect.height;
      c.style.left = x + 'px';
      c.style.top = y + 'px';
    });
    drawLines();
  }

  function drawLines(){
    if(!hub) return;
    svg.querySelectorAll('path').forEach(p=>p.remove());
    const hubRect = hub.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const hubCenter = {
      x: hubRect.left - wrapRect.left + hubRect.width/2,
      y: hubRect.top - wrapRect.top + hubRect.height/2
    };
    connectedSelectors.forEach(sel=>{
      const el = document.querySelector(sel);
      if(!el) return;
      const r = el.getBoundingClientRect();
      const center = {
        x: r.left - wrapRect.left + r.width/2,
        y: r.top - wrapRect.top + r.height/2
      };
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      const midX = (hubCenter.x + center.x)/2;
      const midY = (hubCenter.y + center.y)/2 - 20;
      path.setAttribute('d', `M ${hubCenter.x} ${hubCenter.y} Q ${midX} ${midY} ${center.x} ${center.y}`);
      svg.appendChild(path);
    });
  }

  if(!reduceMotion && window.innerWidth > 860){
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    wrap.addEventListener('mousemove', (e)=>{
      const rect = wrap.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    function loop(){
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      cards.forEach(c=>{
        const depth = parseFloat(c.dataset.depth || 1);
        const px = curX * depth * 10;
        const py = curY * depth * 10;
        c.style.transform = `translate(${px}px, ${py}px)`;
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  window.addEventListener('resize', position);
  window.addEventListener('load', position);
  position();
  }

  /* ---- reveal on scroll ---- */
  if(!reduceMotion){
    document.querySelectorAll('.section-inner').forEach(el=>el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  }

  /* ---- store mockup parallax ---- */
  const storeMockup = document.getElementById('storeMockup');
  if(storeMockup && !reduceMotion && window.innerWidth > 860){
    const storeCard = storeMockup.closest('.product-card');
    let sTargetX=0, sTargetY=0, sCurX=0, sCurY=0;
    storeCard.addEventListener('mousemove', (e)=>{
      const r = storeCard.getBoundingClientRect();
      sTargetX = ((e.clientX - r.left)/r.width - 0.5) * 12;
      sTargetY = ((e.clientY - r.top)/r.height - 0.5) * 12;
    });
    storeCard.addEventListener('mouseleave', ()=>{ sTargetX = 0; sTargetY = 0; });
    function storeLoop(){
      sCurX += (sTargetX - sCurX) * 0.06;
      sCurY += (sTargetY - sCurY) * 0.06;
      storeMockup.style.transform = `translate(${sCurX}px, ${sCurY}px)`;
      requestAnimationFrame(storeLoop);
    }
    storeLoop();
  }

  /* ---- store modal ---- */
  const storeModal = document.getElementById('storeModal');
  const storeCta = document.getElementById('storeCta');
  const modalClose = document.getElementById('modalClose');
  if(storeCta && storeModal){
    storeCta.addEventListener('click', ()=> storeModal.classList.add('open'));
    modalClose.addEventListener('click', ()=> storeModal.classList.remove('open'));
    storeModal.addEventListener('click', (e)=>{ if(e.target === storeModal) storeModal.classList.remove('open'); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') storeModal.classList.remove('open'); });
  }

  /* ---- laboratório de ideias -> Formspree (envio via AJAX) ---- */
  const labForm = document.getElementById('labForm');
  const labFeedback = document.getElementById('labFeedback');
  if(labForm){
    labForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn = labForm.querySelector('.lab-submit');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      labFeedback.textContent = '';
      labFeedback.className = 'lab-feedback';
      try{
        const res = await fetch(labForm.action, {
          method: 'POST',
          body: new FormData(labForm),
          headers: { 'Accept': 'application/json' }
        });
        if(res.ok){
          labForm.reset();
          labFeedback.textContent = 'Solicitação enviada! Em breve eu retorno o contato.';
          labFeedback.className = 'lab-feedback ok';
        }else{
          labFeedback.textContent = 'Algo deu errado. Tente novamente ou chame no WhatsApp.';
          labFeedback.className = 'lab-feedback err';
        }
      }catch(err){
        labFeedback.textContent = 'Sem conexão. Tente novamente ou chame no WhatsApp.';
        labFeedback.className = 'lab-feedback err';
      }finally{
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  /* ---- FAQ: mantém uma resposta aberta por vez ---- */
  const faqItems = document.querySelectorAll('.home-faq details');
  faqItems.forEach(item=>item.addEventListener('toggle',()=>{
    if(item.open){
      faqItems.forEach(other=>{ if(other !== item) other.open = false; });
    }
  }));
