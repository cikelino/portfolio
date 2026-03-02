// Gestione cursore personalizzato
const dot = document.getElementById('cursor-dot');
const glow = document.getElementById('cursor-glow');

let mx = 0, my = 0, gx = 0, gy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

(function glowLoop() {
  gx += (mx - gx) * 0.07;
  gy += (my - gy) * 0.07;
  glow.style.left = gx + 'px';
  glow.style.top = gy + 'px';
  requestAnimationFrame(glowLoop);
})();