function createCarousel(container) {
  const track = container.querySelector('.carousel-track');
  const previous = container.querySelector('[data-direction="prev"]');
  const next = container.querySelector('[data-direction="next"]');
  const counter = container.querySelector('.carousel-count');
  const cards = () => [...track.children].filter(card => !card.hidden);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollTimer;
  function update() {
    const items = cards();
    const left = track.scrollLeft;
    const right = left + track.clientWidth;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = left <= 2;
    next.disabled = max - left <= 2;
    const indexed = items.map((card, index) => ({card, index}));
    const fullyVisible = indexed.filter(({card}) => card.offsetLeft >= left - 2 && card.offsetLeft + card.offsetWidth <= right + 2);
    const visible = fullyVisible.length ? fullyVisible : indexed.filter(({card}) => card.offsetLeft < right && card.offsetLeft + card.offsetWidth > left);
    if (!visible.length) { counter.textContent = `0 из ${items.length}`; return; }
    const first = visible[0].index + 1;
    const last = visible[visible.length - 1].index + 1;
    counter.textContent = `${first === last ? first : `${first}–${last}`} из ${items.length}`;
  }
  function goTo(index) {
    const items = cards();
    const card = items[Math.max(0, Math.min(index, items.length - 1))];
    if (!card) return;
    track.scrollTo({left:card.offsetLeft, behavior:reduceMotion.matches ? 'auto' : 'smooth'});
  }
  function step(direction) {
    const items = cards();
    if (!items.length) return;
    let nearest = 0;
    items.forEach((card, index) => {
      if (Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(items[nearest].offsetLeft - track.scrollLeft)) nearest = index;
    });
    goTo(nearest + direction);
  }
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(update, 100);
  }, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : cards().length - 1);
    }
  });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  else window.addEventListener('resize', update);
  update();
  return {refresh() { track.scrollTo({left:0, behavior:'auto'}); update(); }};
}
const carousels = new Map([...document.querySelectorAll('[data-carousel]')].map(container => [container.dataset.carousel, createCarousel(container)]));
document.addEventListener('review-filter-change', () => carousels.get('reviews').refresh());
