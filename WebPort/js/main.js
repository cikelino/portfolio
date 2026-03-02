// Punto di ingresso — funzionalità generali

// ── TYPING EFFECT ──
const phrases = [
  'Full Stack Developer Junior',
  'React & Node.js',
  'Microsoft 365 Expert',
  'UI / UX Enthusiast'
];
let phraseIndex = 0;
const typingEl = document.getElementById('typingText');

function typePhrase() {
  const phrase = phrases[phraseIndex % phrases.length];
  let i = 0;
  typingEl.textContent = '';

  const typeInterval = setInterval(() => {
    typingEl.textContent += phrase[i];
    i++;
    if (i >= phrase.length) {
      clearInterval(typeInterval);
      setTimeout(deletePhrase, 2000);
    }
  }, 60);
}

function deletePhrase() {
  const deleteInterval = setInterval(() => {
    typingEl.textContent = typingEl.textContent.slice(0, -1);
    if (!typingEl.textContent.length) {
      clearInterval(deleteInterval);
      phraseIndex++;
      setTimeout(typePhrase, 350);
    }
  }, 35);
}

setTimeout(typePhrase, 2200);

// ── SCROLL TO TOP ──
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── CONTACT FORM ──
const form = document.getElementById('contactForm');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button');
  btn.textContent = 'Invio in corso...';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.reset();
      document.getElementById('formSuccess').style.display = 'block';
    }
    btn.textContent = 'Invia Messaggio →';
  } catch (err) {
    btn.textContent = 'Riprova';
  }
});