// Unico punto di registrazione GSAP — tutti gli altri file importano da qui
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export { gsap, ScrollTrigger, ScrollToPlugin }
