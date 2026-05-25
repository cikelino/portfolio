window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  setTimeout(() => {
    // Init while loader is still visible — prevents layout jump from ScrollTrigger pin spacers
    initAnimations();

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const spans  = document.querySelectorAll('#loader-name span');
      const bar    = document.getElementById('loader-bar');
      const loader = document.getElementById('loader');

      const barR = bar.getBoundingClientRect();
      const bCX  = barR.left + barR.width  / 2;
      const bCY  = barR.top  + barR.height / 2;

      const tl = gsap.timeline({ onComplete: () => { loader.style.display = 'none'; } });

      // Letters get sucked into the bar
      tl.to(spans, {
        duration: 0.55,
        ease: 'power3.in',
        x: (_, el) => { const r = el.getBoundingClientRect(); return bCX - (r.left + r.width  / 2); },
        y: (_, el) => { const r = el.getBoundingClientRect(); return bCY - (r.top  + r.height / 2); },
        rotation: () => gsap.utils.random(-200, 200),
        scale: 0,
        opacity: 0,
        stagger: { each: 0.028, from: 'random' },
      });

      // Bar collapses to a point
      tl.to(bar, { scaleX: 0, opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.12');

      // Loader fades out
      tl.to(loader, { opacity: 0, duration: 0.35, ease: 'power2.out' }, '-=0.05');
    }));
  }, 1800);
});

// Orb info tooltip toggle
document.addEventListener('DOMContentLoaded', () => {
  const orbHelp = document.querySelector('.orb-help');
  const orbTooltip = document.getElementById('orbTooltip');
  if (!orbHelp || !orbTooltip) return;

  const tl = gsap.timeline({ paused: true });
  gsap.set(orbTooltip, { autoAlpha: 0, y: 8, scale: 0.97 });
  tl.to(orbTooltip, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out' });

  function openTip() {
    orbTooltip.classList.add('is-visible');
    orbHelp.classList.add('is-active');
    orbHelp.setAttribute('aria-expanded', 'true');
    tl.play();
  }
  function closeTip() {
    orbTooltip.classList.remove('is-visible');
    orbHelp.classList.remove('is-active');
    orbHelp.setAttribute('aria-expanded', 'false');
    tl.reverse();
  }

  orbHelp.addEventListener('click', e => {
    e.stopPropagation();
    orbTooltip.classList.contains('is-visible') ? closeTip() : openTip();
  });
  document.addEventListener('click', e => {
    if (orbTooltip.classList.contains('is-visible') && !orbTooltip.contains(e.target) && e.target !== orbHelp) closeTip();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTip(); });
});
