(function () {
  'use strict';

  const PROJECTS = [
    {
      id: 'c1', num: '01', name: 'WowChePrezzi.it', role: 'Frontend Dev & UX/UI',
      tags: ['React.js', 'TypeScript', 'Tailwind', 'UX/UI'],
      desc: 'Sito comparatore prezzi ispirato ai principali aggregatori. Wireframe, user-flow, interfaccia responsive con filtri, ricerca prodotti e confronto offerte.',
      type: 1,
    },
    {
      id: 'c2', num: '02', name: 'Glami Inside Fashion', role: 'Full-Stack & UX/UI',
      tags: ['React', 'Java', 'Cloudflare', 'Full-Stack'],
      desc: 'Sito web per agenzia di formazione nel settore moda. Backend Java, frontend React, integrazione Cloudflare, Resend, Iubenda e deploy su IONOS.',
      type: 2,
    },
    {
      id: 'c3', num: '03', name: 'Office Seat Booking', role: 'UX/UI Designer',
      tags: ['UX/UI', 'Smart Working', 'Wireframe', 'Design System'],
      desc: "Sistema di prenotazione e turnazione posti smart working. Mappa stilizzata dell'ufficio, interfaccia di prenotazione, visualizzazione disponibilità e notifiche di stato.",
      type: 3,
    },
    {
      id: 'c4', num: '04', name: 'Portfolio 3D', role: 'Creative Developer',
      tags: ['GSAP', 'Three.js', 'CSS', 'Animation'],
      desc: 'Portfolio personale con animazioni 3D, fisica interattiva e transizioni GSAP. Orb interattivo delle skill, carosello circolare e loader con vacuum animation.',
      type: 1,
    },
    {
      id: 'c5', num: '05', name: 'AI Chat Interface', role: 'Full-Stack & AI',
      tags: ['Claude API', 'React', 'Node.js', 'OpenAI'],
      desc: 'Interfaccia di chat AI multi-modello con supporto a Claude e GPT-4. Streaming responses, history management, prompt templating e UI conversazionale.',
      type: 2,
    },
  ];

  const N    = PROJECTS.length;
  const STEP = (Math.PI * 2) / N;   // 72° in radians
  const RX   = 400;                  // horizontal spread (px)
  const RY   = 60;                   // vertical depth cue (px)

  /* Sensitivity: full carousel rotation = 900px drag */
  const SENS = (Math.PI * 2) / 900;

  const stage = document.getElementById('projStage');
  if (!stage) return;

  const cards = Array.from(document.querySelectorAll('.proj-card'));

  /* ── DOTS ── */
  const dotsWrap = document.getElementById('carouselDots');
  const dots = PROJECTS.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot';
    d.setAttribute('aria-label', 'Progetto ' + (i + 1));
    d.addEventListener('click', () => snapTo(i));
    dotsWrap.appendChild(d);
    return d;
  });

  /* ── STATE ── */
  const state   = { angle: 0 };   // GSAP tweens this
  let activeIdx = 0;
  let dragging  = false;
  let wasDrag   = false;
  let startX    = 0, startAngle = 0;
  let velX      = 0, lastX = 0, lastT = 0;

  /* ── 2D FLAT POSITIONING ── */
  function positionCards() {
    const a = state.angle;
    cards.forEach((card, i) => {
      const ca    = i * STEP + a;                    // this card's angle on the ring
      const x     = RX * Math.sin(ca);               // horizontal: 0 = center-front
      const y     = RY * Math.cos(ca) * -0.4;        // subtle vertical arc (front slightly up)
      const depth = Math.cos(ca);                    // 1=front, -1=back

      // Hide cards in the back half of the circle
      if (depth < -0.12) {
        card.style.opacity = '0';
        card.style.zIndex  = '0';
        return;
      }

      const t  = (depth + 1) / 2;                    // 0..1
      const sc = 0.68 + 0.32 * t;                    // 0.68 (side) → 1.0 (front)
      const op = 0.30 + 0.70 * t;                    // 0.30 → 1.00
      const zi = Math.round(1 + 99 * t);

      card.style.transform = `translateX(calc(${x}px - 50%)) translateY(calc(${y}px - 50%)) scale(${sc.toFixed(4)})`;
      card.style.opacity   = op.toFixed(3);
      card.style.zIndex    = zi;
    });
  }

  /* ── ACTIVE INDEX ── */
  function updateActive() {
    const idx = ((Math.round(-state.angle / STEP) % N) + N) % N;
    if (idx === activeIdx) return;
    activeIdx = idx;
    cards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    dots.forEach((d, i)  => d.classList.toggle('is-active',  i === idx));
  }

  /* ── SNAP TO CARD ── */
  function snapTo(idx) {
    let target = -idx * STEP;
    // Always take the shortest arc
    while (target - state.angle >  Math.PI) target -= Math.PI * 2;
    while (target - state.angle < -Math.PI) target += Math.PI * 2;
    gsap.to(state, {
      angle: target, duration: 0.65, ease: 'power3.out', overwrite: true,
      onUpdate() { positionCards(); updateActive(); },
    });
    activeIdx = idx;
    cards.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    dots.forEach((d, i)  => d.classList.toggle('is-active',  i === idx));
  }

  /* ── DRAG ── */
  stage.addEventListener('pointerdown', e => {
    gsap.killTweensOf(state);
    dragging = true; wasDrag = false;
    startX = e.clientX; startAngle = state.angle;
    velX = 0; lastX = e.clientX; lastT = performance.now();
    stage.setPointerCapture(e.pointerId);
    document.body.style.cursor = 'grabbing';
  });

  stage.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) wasDrag = true;
    state.angle = startAngle - dx * SENS;
    positionCards();
    updateActive();
    const now = performance.now(), dt = Math.max(now - lastT, 1);
    velX  = (e.clientX - lastX) / dt;   // px/ms  (positive = moving right)
    lastX = e.clientX; lastT = now;
    e.preventDefault();
  });

  stage.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = '';
    // Project angle forward with momentum
    const projAngle = state.angle - velX * 80 * SENS;
    const nearest   = ((Math.round(-projAngle / STEP) % N) + N) % N;
    snapTo(nearest);
  });

  stage.addEventListener('pointercancel', () => {
    dragging = false; document.body.style.cursor = '';
    snapTo(activeIdx);
  });

  /* ── BUTTONS ── */
  document.getElementById('prevBtn').addEventListener('click', () => snapTo((activeIdx - 1 + N) % N));
  document.getElementById('nextBtn').addEventListener('click', () => snapTo((activeIdx + 1) % N));

  /* ── KEYBOARD ── */
  document.addEventListener('keydown', e => {
    if (document.getElementById('projOverlay').classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); snapTo((activeIdx - 1 + N) % N); }
    if (e.key === 'ArrowRight') { e.preventDefault(); snapTo((activeIdx + 1) % N); }
  });

  /* ── CLICK → DETAIL ── */
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (wasDrag) return;
      if (i !== activeIdx) { snapTo(i); return; }
      openDetail(i);
    });
  });

  /* ── DETAIL OVERLAY ── */
  function openDetail(idx) {
    const p   = PROJECTS[idx];
    const ov  = document.getElementById('projOverlay');
    const con = document.getElementById('overlayContent');
    con.innerHTML = `
      <div class="ov-num">${p.num} / ${String(N).padStart(2, '0')}</div>
      <div class="ov-name">${p.name}</div>
      <div class="ov-role">${p.role}</div>
      <p class="ov-desc">${p.desc}</p>
      <div class="ov-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    `;
    ov.classList.add('is-open');
    ov.setAttribute('aria-hidden', 'false');
    gsap.fromTo('.proj-overlay-panel',
      { y: 70, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.45, ease: 'power3.out' }
    );
    gsap.fromTo('.proj-overlay-backdrop',
      { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
  }

  function closeDetail() {
    const ov = document.getElementById('projOverlay');
    gsap.to('.proj-overlay-panel',    { y: 50, opacity: 0, duration: 0.28, ease: 'power2.in' });
    gsap.to('.proj-overlay-backdrop', {
      opacity: 0, duration: 0.28, ease: 'power2.in',
      onComplete() { ov.classList.remove('is-open'); ov.setAttribute('aria-hidden', 'true'); },
    });
  }

  document.getElementById('overlayClose').addEventListener('click', closeDetail);
  document.getElementById('overlayBackdrop').addEventListener('click', closeDetail);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('projOverlay').classList.contains('is-open')) closeDetail();
  });

  /* ── CANVAS INIT ── */
  setTimeout(() => {
    PROJECTS.forEach(p => drawProjectCanvas(p.id, '#10554e', '#826976', p.type));
  }, 150);

  /* ── INIT ── */
  activeIdx = 0;
  cards[0].classList.add('is-active');
  dots[0].classList.add('is-active');
  positionCards();
}());
