// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ========== Hero Carousel ==========
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let currentSlide = 0;
let autoTimer = null;
const AUTO_INTERVAL = 6000;

function goToSlide(index) {
  index = (index + slides.length) % slides.length;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  const newDot = dots[currentSlide];
  newDot.classList.remove('active');
  void newDot.offsetWidth;
  newDot.classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAuto() {
  stopAuto();
  autoTimer = setInterval(nextSlide, AUTO_INTERVAL);
}
function stopAuto() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.slide, 10);
    goToSlide(idx);
    startAuto();
  });
});
nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });
prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });

// Pause on hover
const heroEl = document.getElementById('home');
heroEl.addEventListener('mouseenter', stopAuto);
heroEl.addEventListener('mouseleave', startAuto);

// Touch swipe
let touchStartX = 0;
heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
heroEl.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) nextSlide(); else prevSlide();
    startAuto();
  }
});

// Keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { nextSlide(); startAuto(); }
  if (e.key === 'ArrowLeft') { prevSlide(); startAuto(); }
});

startAuto();

// Event tabs filter
const tabs = document.querySelectorAll('.event-tab');
const eventCards = document.querySelectorAll('#eventsGrid .event-card');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    eventCards.forEach(card => {
      const match = card.dataset.type === filter;
      card.hidden = !match;
      if (match) {
        card.classList.remove('visible');
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
  });
});
