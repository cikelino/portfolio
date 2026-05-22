window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  setTimeout(() => {
    gsap.to('#loader', {
      opacity: 0, duration: 0.6, ease: 'power2.out',
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        initAnimations();
      }
    });
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
