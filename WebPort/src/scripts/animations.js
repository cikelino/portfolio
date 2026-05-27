import { gsap, ScrollTrigger } from './gsap-config.js'
import { initHeroCanvas } from './canvas.js'

export function initAnimations() {
  // Hero entrance
  gsap.from('.hero-tag', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.from('.hero-name .word', { opacity: 0, y: 80, skewY: 4, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.3 });
  gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.7 });
  gsap.from('.hero-ctas', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out', delay: 0.9 });
  gsap.from('.hero-scroll', { opacity: 0, duration: 0.7, delay: 1.2 });
  gsap.from('.hero-stage-wrap', { opacity: 0, scale: 0.88, rotate: -4, duration: 1.1, ease: 'power3.out', delay: 0.35 });
  gsap.from('.hero-stage-label, .hero-stage-badge', { opacity: 0, y: 18, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.85 });

  // Scroll-triggered: section headings
  gsap.utils.toArray('.section-label, .section-title, .about-big-text, .ai-content h2').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Count-up stats
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to({ val: 0 }, {
        val: target, duration: 1.4, ease: 'power2.out',
        onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); },
        onComplete: () => { el.textContent = target + (target === 15 ? '+' : ''); }
      })
    });
  });

  // Skill cards
  gsap.from('.skill-category', {
    opacity: 0, y: 50, stagger: 0.08, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.skills-grid', start: 'top 85%', once: true }
  });

  // Timeline
  gsap.from('.timeline-item', {
    opacity: 0, x: -30, stagger: 0.15, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.timeline', start: 'top 85%', once: true }
  });

  // Circular carousel reveal
  gsap.from('.proj-carousel-wrap', {
    opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#work', start: 'top 75%', once: true }
  });

  // AI section
  gsap.from('.ai-orb', {
    scale: 0.6, opacity: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '#ai-section', start: 'top 70%', once: true }
  });
  gsap.from('.ai-feature', {
    opacity: 0, x: 30, stagger: 0.15, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.ai-features', start: 'top 85%', once: true }
  });
  gsap.from('.ai-chip-float', {
    opacity: 0, scale: 0.8, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '#ai-section', start: 'top 75%', once: true }
  });

  // Contact
  gsap.from('.contact-headline, .contact-sub, .contact-links, .email-big', {
    opacity: 0, y: 30, stagger: 0.12, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true }
  });

  // Navbar scroll state
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: self => document.getElementById('navbar').classList.toggle('scrolled', self.progress > 0)
  });

  // Marquee reveal
  gsap.from('.marquee-section', {
    opacity: 0, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.marquee-section', start: 'top 95%', once: true }
  });

  initHeroCanvas();
}
