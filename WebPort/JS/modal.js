// Logica modal progetti
const overlay = document.getElementById('modalOverlay');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('modalEmoji').innerHTML = card.dataset.emoji;
    document.getElementById('modalTitle').textContent = card.dataset.title;
    document.getElementById('modalDesc').textContent = card.dataset.desc;
    document.getElementById('modalTags').innerHTML = card.dataset.tags
      .split(',')
      .map(t => '<span class="tag">' + t.trim() + '</span>')
      .join('');
    document.getElementById('modalLinks').innerHTML =
      '<a href="' + card.dataset.github + '" target="_blank" class="modal-link secondary">GitHub &rarr;</a>' +
      '<a href="' + card.dataset.live + '" target="_blank" class="modal-link primary">Live Demo &rarr;</a>';
    overlay.classList.add('open');
  });
});

// Chiudi con X
document.getElementById('modalClose').addEventListener('click', () => {
  overlay.classList.remove('open');
});

// Chiudi cliccando fuori
overlay.addEventListener('click', e => {
  if (e.target === overlay) overlay.classList.remove('open');
});

// Chiudi con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') overlay.classList.remove('open');
});