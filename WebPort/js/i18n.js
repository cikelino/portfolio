// ─── SISTEMA DI TRADUZIONE IT / EN — Flip 3D + Slide Indicator ───────────────

const translations = {
  it: {
    'about-tag':   'Chi Sono',
    'about-title': 'Codice, design<br />e tanta <span class="italic">passione.</span>',
    'about-p1': 'Mi chiamo <strong>Gabriele Sergio</strong>, sono un <strong>Web Developer Full Stack Junior</strong> con una forte inclinazione verso il Front-End e l\'UI/UX Design. Ho iniziato il mio percorso con una formazione tecnica in informatica e telecomunicazioni, per poi approfondire lo sviluppo web attraverso un corso intensivo di Full Stack Development.',
    'about-p2': 'Nel tempo ho sviluppato competenze su uno stack moderno che include <strong>React</strong>, <strong>Node.js</strong>, <strong>TypeScript</strong>, <strong>CSS avanzato</strong> e <strong>GSAP</strong> \u2014 strumenti che uso per costruire interfacce fluide, animate e curate nei minimi dettagli.',
    'about-p3': 'Sono una persona determinata, analitica e sempre orientata alla crescita. Che si tratti di risolvere un problema complesso o di perfezionare un\u2019interfaccia, mi impegno a trovare la soluzione migliore. Aperto a nuove sfide, collaborazioni e opportunit\u00e0 professionali.',
    'lang-it-name':  'Italiano',
    'lang-it-level': 'Madrelingua',
    'lang-en-name':  'Inglese',
    'lang-en-level': 'Intermedio \u2014 B2',
  },
  en: {
    'about-tag':   'About Me',
    'about-title': 'Code, design<br />and a lot of <span class="italic">passion.</span>',
    'about-p1': 'My name is <strong>Gabriele Sergio</strong>, I\'m a <strong>Junior Full Stack Web Developer</strong> with a strong focus on Front-End and UI/UX Design. I started my journey with a technical background in computer science and telecommunications, then deepened my web development skills through an intensive Full Stack Development course.',
    'about-p2': 'Over time I\'ve built expertise on a modern stack including <strong>React</strong>, <strong>Node.js</strong>, <strong>TypeScript</strong>, <strong>advanced CSS</strong> and <strong>GSAP</strong> \u2014 tools I use to craft fluid, animated and detail-oriented interfaces.',
    'about-p3': 'I\'m a determined, analytical person always focused on growth. Whether it\'s solving a complex problem or refining an interface, I\'m committed to finding the best solution. Open to new challenges, collaborations and professional opportunities.',
    'lang-it-name':  'Italian',
    'lang-it-level': 'Native',
    'lang-en-name':  'English',
    'lang-en-level': 'Intermediate \u2014 B2',
  }
};

let currentLang = 'it';
let isAnimating = false;

// ── FLIP 3D su un singolo elemento ───────────────────────────────────────────
function flipElement(el, newHTML, delay) {
  return new Promise(resolve => {
    gsap.to(el, {
      rotateX: 90,
      opacity: 0,
      duration: 0.22,
      delay: delay,
      ease: 'power2.in',
      transformOrigin: '50% 50%',
      onComplete: () => {
        el.innerHTML = newHTML;
        gsap.fromTo(el,
          { rotateX: -90, opacity: 0 },
          {
            rotateX: 0,
            opacity: 1,
            duration: 0.28,
            ease: 'back.out(1.4)',
            onComplete: resolve
          }
        );
      }
    });
  });
}

// ── ANIMA BOTTONI — solo glow ─────────────────────────────────────────────────
function animateLangButtons(lang) {
  document.querySelectorAll('.lang-item').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === lang);
  });

  // Badge pop sul bottone attivo
  const badge = document.querySelector(`.lang-item[data-lang="${lang}"] .lang-badge`);
  if (badge) {
    gsap.fromTo(badge,
      { scale: 0.75, rotate: -8 },
      { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.5)' }
    );
  }
}

// ── SWITCH PRINCIPALE ─────────────────────────────────────────────────────────
function switchLang(lang) {
  if (lang === currentLang || isAnimating) return;
  isAnimating = true;
  currentLang = lang;

  const t = translations[lang];

  // Anima bottoni subito
  animateLangButtons(lang);

  // Raccogli targets nella sezione about
  const targets = Array.from(document.querySelectorAll('#about [data-i18n]'))
    .filter(el => t[el.dataset.i18n] !== undefined);

  if (!targets.length) { isAnimating = false; return; }

  // Lancia il flip su ogni elemento con stagger
  const promises = targets.map((el, i) =>
    flipElement(el, t[el.dataset.i18n], i * 0.07)
  );

  // Sblocca dopo l'ultima animazione
  Promise.all(promises).then(() => { isAnimating = false; });
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Aggiungi perspective al container per il 3D
  const aboutSection = document.querySelector('#about');
  if (aboutSection) aboutSection.style.perspective = '800px';

  // Event listeners
  document.querySelectorAll('.lang-item').forEach(el => {
    el.addEventListener('click', () => switchLang(el.dataset.lang));
  });
});