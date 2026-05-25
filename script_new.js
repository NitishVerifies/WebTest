document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // ANIMATED CIRCUIT BOARD CANVAS BACKGROUND
  // Only runs if canvas exists (main page only)
  // ============================================
  const canvas = document.getElementById('circuitCanvas');
  if (canvas) {
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

    for (let i = 0; i < NUM_NODES; i++) {
      nodes.push({
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        r: rand(2, 4),
        pulse: rand(0, Math.PI * 2),
        speed: rand(0.01, 0.03)
      });
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && Math.random() > 0.6) {
          edges.push({ a: i, b: j, signal: Math.random(), signalSpeed: rand(0.003, 0.008) });
        }
      }
    }

    function drawCircuit() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      edges.forEach(e => {
        const a = nodes[e.a], b = nodes[e.b];
        const dx = b.x - a.x, dy = b.y - a.y;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + dx * 0.5, a.y);
        ctx.lineTo(a.x + dx * 0.5, a.y + dy);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(0,229,255,0.12)';
        ctx.lineWidth = 0.7;
        ctx.stroke();

        e.signal = (e.signal + e.signalSpeed) % 1;
        const t = e.signal;
        let sx, sy;
        if (t < 0.5) {
          sx = a.x + dx * 0.5 * (t / 0.5);
          sy = a.y;
        } else {
          const p = (t - 0.5) / 0.5;
          sx = a.x + dx * 0.5 + (b.x - (a.x + dx * 0.5)) * p;
          sy = a.y + dy * p;
        }
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,255,0.7)';
        ctx.fill();
      });

      nodes.forEach(n => {
        n.pulse += n.speed;
        const alpha = 0.4 + 0.4 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${alpha})`;
        ctx.fill();
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
  }

  // ============================================
  // ACTIVE NAV HIGHLIGHT ON SCROLL
  // Only runs if there are sections to observe
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active',
              link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });

    sections.forEach(s => navObserver.observe(s));
  }

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
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;

  // ============================================
  // MOBILE HAMBURGER MENU
  // Works on every page that has the button + drawer
  // ============================================
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      drawer.classList.toggle('open');
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('open');
      });
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
      }
    });
  }

});
