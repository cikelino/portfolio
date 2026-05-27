import { ScrollTrigger } from './gsap-config.js'

const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
const DURATION = 600;
const FRAME_MS = 1000 / 60;

class TextScramble {
  constructor(el) {
    this.el       = el;
    this.original = el.textContent;
    this.rafId    = null;
  }

  scramble() {
    let frame    = 0;
    let lastTime = 0;
    const totalFrames = DURATION / FRAME_MS;

    const tick = now => {
      if (now - lastTime < FRAME_MS) {
        this.rafId = requestAnimationFrame(tick);
        return;
      }
      lastTime = now;
      frame++;

      const progress = frame / totalFrames;
      const original = this.original;
      let output = '';

      for (let i = 0; i < original.length; i++) {
        const ch = original[i];
        if (ch === ' ' || ch === '\n' || ch === ' ') {
          output += ch;
          continue;
        }
        if (i / original.length < progress) {
          output += ch;
        } else {
          output += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      this.el.textContent = output;

      if (progress >= 1) {
        this.el.textContent = this.original;
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };

    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(tick);
  }
}

document.querySelectorAll('.section-title').forEach(title => {
  const scrambler = new TextScramble(title);
  let hasPlayed   = false;

  ScrollTrigger.create({
    trigger: title,
    start: 'top 92%',
    onEnter: () => {
      if (hasPlayed) return;
      hasPlayed = true;
      scrambler.scramble();
    }
  });
});
