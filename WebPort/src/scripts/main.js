// ─── Entry point ─────────────────────────────────────────────────────────────
// Lenis deve essere il primo import (collega GSAP ticker prima di tutto)
import lenis from './lenis-init.js'
import './cursor.js'
import './ticker.js'
import './tilt.js'
import './scramble.js'
import './skills-orb.js'
import './proj-carousel.js'

import { gsap } from './gsap-config.js'
import { initAnimations } from './animations.js'

// ─── Menu mobile (hamburger) ─────────────────────────────────────────────────
const burger     = document.getElementById('navBurger')
const mobileMenu  = document.getElementById('mobileMenu')
if (burger && mobileMenu) {
  const openMenu = () => {
    mobileMenu.classList.add('open')
    burger.classList.add('open')
    burger.setAttribute('aria-expanded', 'true')
    mobileMenu.setAttribute('aria-hidden', 'false')
    document.body.classList.add('menu-open')
    lenis.stop()
  }
  const closeMenu = () => {
    mobileMenu.classList.remove('open')
    burger.classList.remove('open')
    burger.setAttribute('aria-expanded', 'false')
    mobileMenu.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('menu-open')
    lenis.start()
  }
  burger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
  })
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu))
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu()
  })
}

// ─── Loader + animazione vacuum ──────────────────────────────────────────────
// Legato al load reale, con un tempo minimo di visibilità per non risultare brusco.
const LOADER_START = performance.now()
const LOADER_MIN_MS = 900

function runIntro() {
  // Init mentre il loader è ancora visibile — evita layout jump da ScrollTrigger
  initAnimations()

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const spans  = document.querySelectorAll('#loader-name span')
    const bar    = document.getElementById('loader-bar')
    const loader = document.getElementById('loader')

    const barR = bar.getBoundingClientRect()
    const bCX  = barR.left + barR.width  / 2
    const bCY  = barR.top  + barR.height / 2

    const tl = gsap.timeline({ onComplete: () => { loader.style.display = 'none' } })

    tl.to(spans, {
      duration: 0.55,
      ease: 'power3.in',
      x: (_, el) => { const r = el.getBoundingClientRect(); return bCX - (r.left + r.width  / 2) },
      y: (_, el) => { const r = el.getBoundingClientRect(); return bCY - (r.top  + r.height / 2) },
      rotation: () => gsap.utils.random(-200, 200),
      scale: 0,
      opacity: 0,
      stagger: { each: 0.028, from: 'random' },
    })

    tl.to(bar,    { scaleX: 0, opacity: 0, duration: 0.25, ease: 'power2.in' }, '-=0.12')
    tl.to(loader, { opacity: 0, duration: 0.35, ease: 'power2.out' }, '-=0.05')
  }))
}

window.addEventListener('load', () => {
  const elapsed = performance.now() - LOADER_START
  setTimeout(runIntro, Math.max(0, LOADER_MIN_MS - elapsed))
})
