(function () {
  'use strict';

  const LOGOS = [
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',             name: 'React' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',   name: 'TypeScript' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',   name: 'JavaScript' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',             name: 'HTML5' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',               name: 'CSS3' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', name: 'Tailwind' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',           name: 'Vite' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',             name: 'Figma' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',           name: 'Node.js' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',           name: 'Python' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',               name: 'Java' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',             name: 'SQL' },
    { src: 'https://api.iconify.design/simple-icons:github.svg?color=white',                           name: 'GitHub' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',             name: 'Linux' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',           name: 'Vercel' },
    { src: 'https://api.iconify.design/simple-icons:anthropic.svg?color=white',                        name: 'Claude API' },
    { src: 'https://api.iconify.design/simple-icons:openai.svg?color=white',                          name: 'OpenAI' },
  ];

  const stage     = document.getElementById('stage');
  const ellipseEl = document.getElementById('ellipseEl');
  const svgEl     = document.getElementById('connSvg');
  const techCount = document.getElementById('techCount');

  if (!stage || !ellipseEl || !svgEl) return;

  if (techCount) techCount.textContent = LOGOS.length + ' tecnologie';

  let chips = [];
  let RX = 1, RY = 1;
  const CHIP = 38;
  const NS   = 'http://www.w3.org/2000/svg';

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ─── ORB BUILD ─────────────────────────────────────────────── */
  function buildOrb() {
    ellipseEl.querySelectorAll('.logo-chip').forEach(e => e.remove());
    chips = [];
    svgEl.innerHTML = '';

    const W = stage.clientWidth;
    const H = stage.clientHeight;

    RX = W * 0.46;
    RY = H * 0.38;

    ellipseEl.style.width  = RX * 2 + 'px';
    ellipseEl.style.height = RY * 2 + 'px';
    ellipseEl.style.left   = W / 2 + 'px';
    ellipseEl.style.top    = H / 2 + 'px';

    svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);

    LOGOS.forEach((l, i) => {
      const chip = document.createElement('div');
      chip.className = 'logo-chip';

      const img = document.createElement('img');
      img.src = l.src; img.draggable = false;
      chip.appendChild(img);

      const tip = document.createElement('div');
      tip.className = 'tip';
      tip.textContent = l.name;
      chip.appendChild(tip);

      ellipseEl.appendChild(chip);

      const ang = (i / LOGOS.length) * Math.PI * 2;
      const pr  = 0.55;
      const ix  = RX + RX * pr * Math.cos(ang) - CHIP / 2;
      const iy  = RY + RY * pr * Math.sin(ang) - CHIP / 2;

      const st = {
        el: chip, x: ix, y: iy,
        vx: rand(-0.5, 0.5), vy: rand(-0.4, 0.4),
        grabbed: false, ox: 0, oy: 0, hist: [],
      };
      chips.push(st);

      chip.style.left    = ix + 'px';
      chip.style.top     = iy + 'px';
      chip.style.opacity = '0';
      setTimeout(() => {
        chip.style.transition = 'opacity 0.5s ease';
        chip.style.opacity    = '1';
        setTimeout(() => { chip.style.transition = ''; }, 520);
      }, i * 55 + 200);

      chip.addEventListener('pointerdown', e => {
        chip.setPointerCapture(e.pointerId);
        st.grabbed = true;
        chip.classList.add('grabbed');
        document.body.style.cursor = 'grabbing';
        const r = ellipseEl.getBoundingClientRect();
        st.ox   = e.clientX - r.left - st.x;
        st.oy   = e.clientY - r.top  - st.y;
        st.hist = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
        st.vx   = 0; st.vy = 0;
      });

      chip.addEventListener('pointermove', e => {
        if (!st.grabbed) return;
        const r = ellipseEl.getBoundingClientRect();
        st.x = e.clientX - r.left - st.ox;
        st.y = e.clientY - r.top  - st.oy;
        chip.style.left = st.x + 'px';
        chip.style.top  = st.y + 'px';
        const now = performance.now();
        st.hist.push({ x: e.clientX, y: e.clientY, t: now });
        while (st.hist.length > 1 && now - st.hist[0].t > 80) st.hist.shift();
        e.preventDefault();
      });

      chip.addEventListener('pointerup', e => {
        if (!st.grabbed) return;
        st.grabbed = false;
        chip.classList.remove('grabbed');
        document.body.style.cursor = '';
        if (st.hist.length >= 2) {
          const first = st.hist[0], last = st.hist[st.hist.length - 1];
          const dt = (last.t - first.t) / 1000;
          if (dt > 0.005) {
            st.vx = (last.x - first.x) / dt * 0.016;
            st.vy = (last.y - first.y) / dt * 0.016;
            const spd = Math.hypot(st.vx, st.vy);
            if (spd > 16) { st.vx = st.vx / spd * 16; st.vy = st.vy / spd * 16; }
          }
        }
        st.hist = [];
      });

      chip.addEventListener('pointercancel', () => {
        st.grabbed = false;
        chip.classList.remove('grabbed');
        document.body.style.cursor = '';
        st.hist = [];
      });
    });

    requestAnimationFrame(drawConnectors);
  }

  /* ─── SVG CONNECTORS ────────────────────────────────────────── */
  function drawConnectors() {
    svgEl.innerHTML = '';

    const sr  = stage.getBoundingClientRect();
    const cxS = sr.width  / 2;
    const cyS = sr.height / 2;

    function addDot(x, y) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x);  c.setAttribute('cy', y);
      c.setAttribute('r', '2.5');
      c.setAttribute('fill', 'rgba(255,255,255,0.18)');
      svgEl.appendChild(c);
    }

    function addLine(x1, y1, x2, y2) {
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1);
      l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('stroke', 'rgba(255,255,255,0.08)');
      l.setAttribute('stroke-width', '0.5');
      svgEl.appendChild(l);
    }

    document.querySelectorAll('.skills-cats--left .cat-block').forEach(block => {
      const br  = block.getBoundingClientRect();
      const bcy = br.top  + br.height / 2 - sr.top;
      const brx = br.right - sr.left;
      const dy  = bcy - cyS;
      if (Math.abs(dy) >= RY * 0.97) return;
      const ex = cxS - RX * Math.sqrt(1 - (dy / RY) ** 2);
      addDot(ex, bcy);
      addLine(ex - 3, bcy, brx + 8, bcy);
    });

    document.querySelectorAll('.skills-cats--right .cat-block').forEach(block => {
      const br  = block.getBoundingClientRect();
      const bcy = br.top  + br.height / 2 - sr.top;
      const blx = br.left - sr.left;
      const dy  = bcy - cyS;
      if (Math.abs(dy) >= RY * 0.97) return;
      const ex = cxS + RX * Math.sqrt(1 - (dy / RY) ** 2);
      addDot(ex, bcy);
      addLine(ex + 3, bcy, blx - 8, bcy);
    });

    svgEl.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
  }

  /* ─── PHYSICS LOOP ──────────────────────────────────────────── */
  const FRIC = 0.978, BOUNCE = 0.40, AMP = 0.010;

  function loop() {
    const t = Date.now() * 0.001;
    chips.forEach((s, i) => {
      if (s.grabbed) return;
      s.vx += Math.sin(t * 0.36 + i * 1.47) * AMP;
      s.vy += Math.cos(t * 0.26 + i * 1.03) * AMP;
      s.vx *= FRIC; s.vy *= FRIC;
      s.x  += s.vx; s.y  += s.vy;

      const ccx  = s.x + CHIP / 2 - RX;
      const ccy  = s.y + CHIP / 2 - RY;
      const erx  = RX - CHIP / 2 - 2;
      const ery  = RY - CHIP / 2 - 2;
      const norm = Math.hypot(ccx / erx, ccy / ery);
      if (norm > 1) {
        const unx = (ccx / erx) / norm;
        const uny = (ccy / ery) / norm;
        const dot = s.vx * unx + s.vy * uny;
        if (dot > 0) {
          s.vx -= (1 + BOUNCE) * dot * unx;
          s.vy -= (1 + BOUNCE) * dot * uny;
        }
        s.x = RX + unx * erx * 0.995 - CHIP / 2;
        s.y = RY + uny * ery * 0.995 - CHIP / 2;
      }

      s.el.style.left = s.x + 'px';
      s.el.style.top  = s.y + 'px';
    });
    requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildOrb, 120);
  });

  buildOrb();
  loop();

  // Re-draw connectors after full page load + GSAP ScrollTrigger init settle
  window.addEventListener('load', () => setTimeout(drawConnectors, 2600));
}());
