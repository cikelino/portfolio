// Lenis smooth scroll — deve inizializzarsi prima di tutto il resto
import 'lenis/dist/lenis.css'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap-config.js'

const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
})

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add(time => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

export default lenis
