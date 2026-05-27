import { gsap } from './gsap-config.js'

const TILT_MAX = 8;
const PERSP    = 800;

document.querySelectorAll('.project-card, .skill-card').forEach(card => {
  gsap.set(card, { transformPerspective: PERSP, transformStyle: 'preserve-3d' });

  const shine = document.createElement('div');
  shine.className = 'card-shine';
  card.appendChild(shine);
  gsap.set(shine, { opacity: 0 });

  const setRX = gsap.quickTo(card,  'rotateX', { duration: 0.4, ease: 'power2.out' });
  const setRY = gsap.quickTo(card,  'rotateY', { duration: 0.4, ease: 'power2.out' });
  const setSX = gsap.quickTo(shine, 'x',       { duration: 0.3, ease: 'power2.out' });
  const setSY = gsap.quickTo(shine, 'y',       { duration: 0.3, ease: 'power2.out' });
  const setSO = gsap.quickTo(shine, 'opacity', { duration: 0.25 });

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const nx = ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
    const ny = ((e.clientY - rect.top)   / rect.height) * 2 - 1;
    setRY( nx * TILT_MAX);
    setRX(-ny * TILT_MAX);
    setSX((e.clientX - rect.left - rect.width  / 2) * 0.25);
    setSY((e.clientY - rect.top  - rect.height / 2) * 0.25);
    setSO(0.14);
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    setSO(0);
  });
});
