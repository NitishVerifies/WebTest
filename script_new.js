// ============================================
// ANIMATED CIRCUIT BOARD CANVAS BACKGROUND
// ============================================
const canvas = document.getElementById('circuitCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const nodes = [];
const edges = [];
const NUM_NODES = 40;

function rand(min, max) { return Math.random() * (max - min) + min; }

// Create nodes
for (let i = 0; i < NUM_NODES; i++) {
  nodes.push({
    x: rand(0, window.innerWidth),
    y: rand(0, window.innerHeight),
    r: rand(2, 4),
    pulse: rand(0, Math.PI * 2),
    speed: rand(0.01, 0.03)
  });
}

// Connect nearby nodes
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const dx = nodes[i].x - nodes[j].x;
    const dy = nodes[i].y - nodes[j].y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 200 && Math.random() > 0.6) {
      edges.push({ a: i, b: j, signal: Math.random(), signalSpeed: rand(0.003, 0.008) });
    }
  }
}

function drawCircuit(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(e => {
    const a = nodes[e.a], b = nodes[e.b];
    const dx = b.x - a.x, dy = b.y - a.y;

    // Horizontal/vertical only (circuit look)
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(a.x + dx * 0.5, a.y);         // horizontal segment
    ctx.lineTo(a.x + dx * 0.5, a.y + dy);    // vertical segment
    ctx.lineTo(b.x, b.y);                     // final horizontal
    ctx.strokeStyle = 'rgba(0,229,255,0.12)';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Animated signal dot
    e.signal = (e.signal + e.signalSpeed) % 1;
    const t_sig = e.signal;
    let sx, sy;
    if (t_sig < 0.5) {
      sx = a.x + dx * 0.5 * (t_sig / 0.5);
      sy = a.y;
    } else {
      const p = (t_sig - 0.5) / 0.5;
      sx = a.x + dx * 0.5 + (b.x - (a.x + dx * 0.5)) * p;
      sy = a.y + dy * p;
    }
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,229,255,0.7)';
    ctx.fill();
  });

  // Draw nodes
  nodes.forEach((n, i) => {
    n.pulse += n.speed;
    const alpha = 0.4 + 0.4 * Math.sin(n.pulse);
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${alpha})`;
    ctx.fill();
    // crosshair
    ctx.strokeStyle = `rgba(0,229,255,${alpha * 0.5})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(n.x - 6, n.y); ctx.lineTo(n.x + 6, n.y);
    ctx.moveTo(n.x, n.y - 6); ctx.lineTo(n.x, n.y + 6);
    ctx.stroke();
  });

  requestAnimationFrame(drawCircuit);
}
requestAnimationFrame(drawCircuit);

// ============================================
// FILTER NOTES
// ============================================
function filterNotes(topic, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.note-card').forEach(card => {
    card.classList.toggle('hidden', topic !== 'all' && card.dataset.topic !== topic);
  });
}

// ============================================
// ACTIVE NAV ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -60% 0px' });

sections.forEach(s => navObserver.observe(s));

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 70}ms`;
  revealObserver.observe(el);
});

// ============================================
// FOOTER YEAR
// ============================================
document.getElementById('year').textContent = `© ${new Date().getFullYear()}`;

// ============================================
// MOBILE HAMBURGER MENU
// ============================================
const hamburger = document.getElementById('navHamburger');
const drawer    = document.getElementById('navDrawer');

if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  // Close drawer when any link inside it is clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => drawer.classList.remove('open'));
  });

  // Close drawer on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
      drawer.classList.remove('open');
    }
  });
}
