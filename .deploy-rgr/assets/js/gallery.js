// Progressive enhancement: the local grid stays usable if the CDN fails.
const gallery = document.querySelector('#product-gallery');
if (gallery) {
  const status = document.querySelector('#gallery-status');
  const controls = document.querySelector('.gallery-controls');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  try {
    const {default: Swiper} = await import('https://cdn.jsdelivr.net/npm/swiper@12.2.0/swiper-bundle.min.mjs');
    const swiper = new Swiper(gallery, {
      slidesPerView: 1, spaceBetween: 20, speed: motion.matches ? 0 : 350,
      breakpoints: {768: {slidesPerView: 2}},
      navigation: {prevEl: '#gallery-prev', nextEl: '#gallery-next'},
      a11y: {prevSlideMessage: 'Попереднє зображення', nextSlideMessage: 'Наступне зображення', slideLabelMessage: '{{index}} з {{slidesLength}}'},
      on: {slideChange(s) {status.textContent = `Зображення ${s.activeIndex + 1} з 3`;}}
    });
    controls.hidden = false;
    status.textContent = 'Галерея готова. Автоматичного гортання немає.';
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {e.preventDefault(); swiper.slideNext();}
      if (e.key === 'ArrowLeft') {e.preventDefault(); swiper.slidePrev();}
    });
    motion.addEventListener('change', () => {swiper.params.speed = motion.matches ? 0 : 350;});
    addEventListener('pagehide', () => swiper.destroy(true, true), {once:true});
  } catch {
    status.textContent = 'Інтерактивна галерея недоступна. Усі зображення показані списком.';
  }
}
