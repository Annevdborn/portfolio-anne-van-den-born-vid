const dot = document.createElement('div');
dot.id = 'cursor-dot';
document.body.appendChild(dot);

document.addEventListener('mousemove', (e) => {
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
  dot.classList.add('visible');
});

document.addEventListener('mouseleave', () => dot.classList.remove('visible'));

function fitText(el) {
  if (!el) return;
  el.style.fontSize = '100px';
  el.style.width = 'max-content';
  const textWidth = el.offsetWidth;
  el.style.width = '';
  const containerWidth = el.parentElement.clientWidth;
  if (containerWidth > 0 && textWidth > 0) {
    el.style.fontSize = (100 * containerWidth / textWidth) + 'px';
  }
}

function fitAll() {
  fitText(document.querySelector('.name-full'));
  fitText(document.querySelector('.werk-title'));
  fitText(document.querySelector('.werkpagina-heading'));
  fitText(document.querySelector('.laten-titel'));
}

document.fonts.ready.then(fitAll);
window.addEventListener('resize', fitAll);

const menuBtn = document.querySelector('.nav-menu');
const menuOverlay = document.getElementById('menuOverlay');
const menuBackdrop = document.getElementById('menuBackdrop');

const nav = document.querySelector('.nav');

menuBtn.addEventListener('click', () => {
  menuOverlay.classList.toggle('open');
  menuBackdrop.classList.toggle('open');
  nav.classList.toggle('menu-open');
});

menuBackdrop.addEventListener('click', () => {
  menuOverlay.classList.remove('open');
  menuBackdrop.classList.remove('open');
  nav.classList.remove('menu-open');
});


const preview = document.getElementById('skillPreview');
const skillItems = document.querySelectorAll('.skill-item');

if (preview) {
  const previewImg = preview.querySelector('.preview-img');

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    preview.style.left = (mouseX - 270) + 'px';
    preview.style.top  = (mouseY - 140) + 'px';
  });

  skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const img = item.dataset.preview;
      if (img) {
        previewImg.style.backgroundImage = `url("${img}")`;
        previewImg.style.backgroundSize = item.dataset.previewSize || 'cover';
        previewImg.style.backgroundPosition = item.dataset.previewPos || 'center';
        previewImg.style.backgroundRepeat = 'no-repeat';
        preview.classList.add('visible');
      }
    });
    item.addEventListener('mouseleave', () => {
      preview.classList.remove('visible');
    });
  });
}

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

const revealSelectors = [
  '.about-left', '.about-right',
  '.werk-title-wrap',
  '.laten-cta', '.laten-space', '.footer',
  '.project-body', '.project-breedte-foto',
  '.project-foto-rij', '.project-bekijk-ook'
].join(', ');

document.querySelectorAll(revealSelectors).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Stagger for grid items
const staggerSelectors = '.werk-item, .werkpagina-item';
document.querySelectorAll(staggerSelectors).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${Math.min(i * 0.08, 0.32)}s`;
  revealObserver.observe(el);
});

// ── Page exit transition ──
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#') || link.target === '_blank') return;
  link.addEventListener('click', e => {
    e.preventDefault();
    document.body.style.animation = 'none';
    document.body.style.transition = 'opacity 0.35s ease';
    document.body.offsetHeight;
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 370);
  });
});

// ── Werkpagina filter
const filterBtns = document.querySelectorAll('.filter-btn');
const werkItems  = document.querySelectorAll('.werkpagina-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    werkItems.forEach(item => {
      const match = filter === 'alles' || item.dataset.categorie === filter;
      item.classList.toggle('verborgen', !match);
    });
  });
});

const urlFilter = new URLSearchParams(window.location.search).get('filter');
if (urlFilter) {
  const targetBtn = document.querySelector(`.filter-btn[data-filter="${urlFilter}"]`);
  if (targetBtn) targetBtn.click();
}
