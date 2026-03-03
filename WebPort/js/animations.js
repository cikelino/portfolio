// Tutte le animazioni GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. Logo hero — bounce elastico
gsap.fromTo('.hero-logo',
  { opacity: 0, scale: 0.5, y: -30 },
  { opacity: 1, scale: 1, y: 0, duration: 1, delay: 0.3, ease: 'elastic.out(1,0.55)' }
);

// 2. Titolo hero — split lettera per lettera
(function splitHeroTitle() {
  const el = document.getElementById('heroTitle');

  function wrapChars(node) {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      [...node.textContent].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'char';
        s.style.cssText = 'display:inline-block;opacity:0;transform:translateY(50px) rotate(5deg);';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === 1 && node.nodeName !== 'BR') {
      [...node.childNodes].forEach(wrapChars);
    }
  }

  wrapChars(el);
  gsap.to('#heroTitle .char', {
    opacity: 1, y: 0, rotate: 0,
    duration: 0.5, ease: 'back.out(1.7)',
    stagger: 0.03, delay: 0.9
  });
})();

// 3. Sottotitolo, bottoni, social
gsap.fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 2.0, ease: 'power3.out' });
gsap.fromTo('.hero-buttons',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 2.1, ease: 'power3.out' });
gsap.fromTo('.hero-social',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 2.3, ease: 'power3.out' });

// 4. Scroll reveal generico — helper
function reveal(selector, fromProps, toProps) {
  gsap.utils.toArray(selector).forEach(el => {
    gsap.fromTo(el, fromProps, {
      ...toProps,
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });
}

reveal('.section-tag',   { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' });
reveal('.section-title', { opacity: 0, y: 30  }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
reveal('.section-desc',  { opacity: 0, y: 20  }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 });

// 5. Skill cards — stagger con back bounce
gsap.utils.toArray('.skill-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 50, scale: 0.9 },
    {
      opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)',
      delay: (i % 5) * 0.08,
      scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' }
    }
  );
});

// 6. Project cards — entrano da destra
gsap.utils.toArray('.project-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, x: 70 },
    {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
      delay: i * 0.15,
      scrollTrigger: { trigger: card, start: 'top 91%', toggleActions: 'play none none none' }
    }
  );
});

// 7. Timeline — linea che si disegna + items da sinistra
// Timeline — linea centrale
gsap.fromTo('#timelineLine', { height: '0%' }, {
  height: '100%', duration: 1.6, ease: 'power2.inOut',
  scrollTrigger: { trigger: '.timeline-wrap', start: 'top 75%' }
});

// Timeline — card alternata: sx entra da sx, dx entra da dx
gsap.utils.toArray('.timeline-item').forEach((item) => {
  const isLeft = item.classList.contains('tl-left');
  const card   = item.querySelector('.timeline-card');
  const dot    = item.querySelector('.tl-dot');

  if (card) {
    gsap.fromTo(card,
      { opacity: 0, x: isLeft ? -50 : 50 },
      {
        opacity: 1, x: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  }
  if (dot) {
    gsap.fromTo(dot,
      { opacity: 0, scale: 0.4 },
      {
        opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  }
});

// 8. Lang badges
gsap.utils.toArray('.lang-item').forEach((item, i) => {
  gsap.fromTo(item,
    { opacity: 0, scale: 0.75 },
    {
      opacity: 1, scale: 1, duration: 0.5, delay: i * 0.12, ease: 'back.out(2)',
      scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }
    }
  );
});

// 9. Contact
gsap.fromTo('.contact-email', { opacity: 0, y: -20 }, {
  opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-email', start: 'top 88%', toggleActions: 'play none none none' }
});

gsap.fromTo('.contact-form', { opacity: 0, y: 30 }, {
  opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: '.contact-form', start: 'top 88%', toggleActions: 'play none none none' }
});

// 10. Parallax logo — leggero per evitare scatti
gsap.to('.hero-logo', {
  y: -20, ease: 'none', immediateRender: false,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});