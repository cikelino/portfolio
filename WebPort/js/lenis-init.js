// Lenis smooth scroll — deve caricare PRIMA di tutto il resto
// Pattern ufficiale Lenis v1 + GSAP ScrollTrigger

const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

// Connette Lenis a GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add(time => {
  lenis.raf(time * 1000); // GSAP usa secondi, Lenis vuole ms
});

gsap.ticker.lagSmoothing(0); // evita compensazione lag di GSAP

// Espone globalmente
window.lenis = lenis;
