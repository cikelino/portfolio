// Particelle canvas di sfondo
const cv = document.getElementById('particles-canvas');
const ctx = cv.getContext('2d');
let W, H;

function resize() {
  W = cv.width = window.innerWidth;
  H = cv.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function rnd(a, b) {
  return Math.random() * (b - a) + a;
}

class Particle {
  constructor() { this.init(true); }

  init(full) {
    this.x = rnd(0, W);
    this.y = full ? rnd(0, H) : H + 8;
    this.r = rnd(1, 3.2);
    this.vx = rnd(-0.2, 0.2);
    this.vy = rnd(-0.15, -0.4);
    this.a = rnd(0.15, 0.65);
    this.col = Math.random() > 0.45 ? '#4ade80' : '#22c55e';
    this.sq = Math.random() > 0.72;
  }

  tick() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10 || this.x < -10 || this.x > W + 10) {
      this.init(false);
    }
  }

  draw() {
    ctx.globalAlpha = this.a;
    ctx.fillStyle = this.col;
    if (this.sq) {
      ctx.fillRect(this.x, this.y, this.r * 2.2, this.r * 2.2);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const particles = Array.from({ length: 130 }, () => new Particle());

(function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.tick(); p.draw(); });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
})();