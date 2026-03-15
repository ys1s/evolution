/* ═══════════════════════════════════════════════
   EVOLUTION — Sistema Solar
   Script Principal
   script.js
═══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   STARFIELD — Campo de estrelas animado
══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 260; i++) {
      stars.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.2 + 0.2,
        op: Math.random() * 0.7 + 0.1,
        sp: Math.random() * 2   + 1,
      });
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      const o = s.op * (0.4 + 0.6 * Math.abs(Math.sin(t / s.sp * 0.008)));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${o})`;
      ctx.fill();
    });
    t++;
    requestAnimationFrame(draw);
  }

  resize();
  initStars();
  draw();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();


/* ══════════════════════════════════════════════
   FADE-IN — Animação de entrada ao rolar
══════════════════════════════════════════════ */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));


/* ══════════════════════════════════════════════
   ACTIVE NAV — Destaca o botão da seção visível
══════════════════════════════════════════════ */
const allSections = document.querySelectorAll('[id]');
const navLinks    = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  allSections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});


/* ══════════════════════════════════════════════
   MOUSE GLOW — Efeito de luz nos cards de planetas
══════════════════════════════════════════════ */
document.querySelectorAll('.planet-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
    const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
    card.style.setProperty('--mx', x);
    card.style.setProperty('--my', y);
  });
});


/* ══════════════════════════════════════════════
   QUIZ — Verificação de respostas
══════════════════════════════════════════════ */
document.getElementById('btnVerificar').addEventListener('click', function () {
  const questions = document.querySelectorAll('.quiz-q');
  let score    = 0;
  let answered = 0;

  questions.forEach(q => {
    const correct  = q.dataset.answer;
    const selected = q.querySelector('input[type="radio"]:checked');
    const options  = q.querySelectorAll('.quiz-option');

    if (!selected) return; // pula se não respondida
    answered++;

    options.forEach(opt => {
      const val = opt.querySelector('input').value;
      opt.classList.add('disabled');
      if (val === correct)                           opt.classList.add('correct');
      if (selected.value === val && val !== correct) opt.classList.add('wrong');
    });

    if (selected.value === correct) score++;
  });

  // Exige que todas as perguntas sejam respondidas
  if (answered < questions.length) {
    alert('Por favor, responda todas as perguntas antes de verificar!');
    questions.forEach(q => {
      q.querySelectorAll('.quiz-option').forEach(o => {
        o.classList.remove('correct', 'wrong', 'disabled');
      });
    });
    return;
  }

  // Mensagens de resultado por pontuação
  const msgs = [
    'Continue estudando!',
    'Quase lá!',
    'Muito bom!',
    'Excelente!',
    'Perfeito!',
  ];
  const msgIndex = Math.round((score / questions.length) * 4);

  document.getElementById('scoreNum').textContent = score + ' / ' + questions.length;
  document.getElementById('scoreTxt').textContent  = msgs[msgIndex];
  document.getElementById('quizScore').style.display = 'block';

  document.getElementById('btnVerificar').style.display = 'none';
  document.getElementById('btnReiniciar').style.display = 'inline-flex';
});


/* ── Reiniciar quiz ── */
document.getElementById('btnReiniciar').addEventListener('click', function () {
  document.querySelectorAll('.quiz-q').forEach(q => {
    q.querySelectorAll('.quiz-option').forEach(o => {
      o.classList.remove('correct', 'wrong', 'disabled');
    });
    q.querySelectorAll('input[type="radio"]').forEach(r => (r.checked = false));
  });

  document.getElementById('quizScore').style.display  = 'none';
  document.getElementById('btnVerificar').style.display = 'inline-flex';
  document.getElementById('btnReiniciar').style.display = 'none';
});
