export function drawProjectCanvas(id, colorA, colorB, type) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 520;
  canvas.height = canvas.offsetHeight || 300;
  const w = canvas.width, h = canvas.height;

  let active = false;
  new IntersectionObserver(([e]) => {
    active = e.isIntersecting;
    if (active) draw(0);
  }, { threshold: 0.05 }).observe(canvas);

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#111');
    bg.addColorStop(1, '#0d0d0d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    if (type === 1) {
      ctx.strokeStyle = 'rgba(16,85,78,0.18)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      const r = ctx.createRadialGradient(w*0.6 + Math.sin(t*0.5)*20, h*0.4 + Math.cos(t*0.4)*15, 0, w*0.6, h*0.4, 180);
      r.addColorStop(0, colorA + '55'); r.addColorStop(1, 'transparent');
      ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);
      ctx.font = 'bold 14px monospace'; ctx.fillStyle = 'rgba(16,85,78,0.5)';
      ['wowcheprezzi.it', '← comparatore prezzi →', '€ 29.99', '€ 24.99', '€ 31.99']
        .forEach((l, i) => ctx.fillText(l, 30, 60 + i * 40));
    } else if (type === 2) {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h/2 + i * 20 - 40);
        for (let x = 0; x <= w; x += 5) {
          ctx.lineTo(x, h/2 + Math.sin(x * 0.02 + t + i) * (20 + i * 5) + i * 15 - 30);
        }
        ctx.strokeStyle = `rgba(130,105,118,${0.06 + i * 0.03})`; ctx.lineWidth = 1.5; ctx.stroke();
      }
      const g2 = ctx.createRadialGradient(w*0.3, h*0.5, 0, w*0.3, h*0.5, 150);
      g2.addColorStop(0, colorB + '40'); g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
      ctx.font = 'bold 32px serif'; ctx.fillStyle = 'rgba(255,222,173,0.12)';
      ctx.fillText('GLAMI', 30, h/2 + 10 + Math.sin(t * 0.3) * 3);
    } else {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
          const x = 50 + col * 55, y = 80 + row * 50;
          const active = (row + col) % 3 !== 0;
          ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = active ? colorA + 'cc' : 'rgba(255,255,255,0.08)'; ctx.fill();
          if (active) {
            ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2);
            ctx.strokeStyle = colorA + '33'; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      ctx.font = '11px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillText('POSTAZIONE DISPONIBILE', 50, h - 30);
    }
    if (active) requestAnimationFrame(() => draw(t + 0.02));
  }
}

export function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const state = { mx: 0, my: 0, tx: 0, ty: 0, t: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    state.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    state.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });
  canvas.addEventListener('mouseleave', () => { state.tx = 0; state.ty = 0; });
  window.addEventListener('resize', resize);
  resize();

  function drawNode(x, y, r, fill, stroke, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = stroke; ctx.stroke();
    ctx.restore();
  }

  function loop() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    state.mx += (state.tx - state.mx) * 0.06;
    state.my += (state.ty - state.my) * 0.06;
    state.t += 0.012;

    const cx = w / 2 + state.mx * 26;
    const cy = h / 2 + state.my * 20;

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.32);
    g.addColorStop(0, 'rgba(130,105,118,0.28)');
    g.addColorStop(0.5, 'rgba(16,85,78,0.12)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    [80, 128, 176].forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r + Math.sin(state.t * 1.5 + idx) * 2, 0, Math.PI * 2);
      ctx.strokeStyle = idx === 1 ? 'rgba(255,222,173,0.1)' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1; ctx.stroke();
    });

    ['UI', 'MOTION', 'LLM', 'SYSTEMS', 'FRONTEND', 'INTERACTION'].forEach((tag, i) => {
      const angle = (Math.PI * 2 / 6) * i + state.t * 0.18;
      const tx = cx + Math.cos(angle) * 150;
      const ty = cy + Math.sin(angle) * 110;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tx, ty);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1; ctx.stroke();
      drawNode(tx, ty, 4.5, i % 2 === 0 ? 'rgba(255,222,173,0.82)' : 'rgba(130,105,118,0.82)', 'rgba(255,255,255,0.16)', 0.95);
      const boxW = 84, boxH = 30, radius = 14;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tx - boxW/2 + radius, ty - boxH/2);
      ctx.arcTo(tx + boxW/2, ty - boxH/2, tx + boxW/2, ty + boxH/2, radius);
      ctx.arcTo(tx + boxW/2, ty + boxH/2, tx - boxW/2, ty + boxH/2, radius);
      ctx.arcTo(tx - boxW/2, ty + boxH/2, tx - boxW/2, ty - boxH/2, radius);
      ctx.arcTo(tx - boxW/2, ty - boxH/2, tx + boxW/2, ty - boxH/2, radius);
      ctx.fillStyle = 'rgba(7,7,7,0.72)';
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(247,241,232,0.9)';
      ctx.font = '600 10px DM Sans'; ctx.textAlign = 'center';
      ctx.fillText(tag, tx, ty + 4);
      ctx.restore();
    });

    const coreGrad = ctx.createRadialGradient(cx - 18, cy - 20, 8, cx, cy, 70);
    coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
    coreGrad.addColorStop(0.24, 'rgba(255,222,173,0.88)');
    coreGrad.addColorStop(0.58, 'rgba(130,105,118,0.82)');
    coreGrad.addColorStop(1, 'rgba(16,85,78,0.58)');
    drawNode(cx, cy, 54 + Math.sin(state.t * 2.2) * 3, coreGrad, 'rgba(255,255,255,0.22)');

    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = '600 12px DM Sans'; ctx.textAlign = 'center';
    ctx.fillText('CREATIVE CORE', cx, cy + 4);
    ctx.restore();

    requestAnimationFrame(loop);
  }
  loop();
}
