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

export async function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const { initFerrofluidSphere } = await import('./ferrofluid-sphere.js');
  initFerrofluidSphere(canvas);
}
