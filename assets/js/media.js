/* Lab 10: independent classic script; no additional ES module/import-map ordering. */
(() => {
  'use strict';
  const root = document.querySelector('#media-lab');
  if (!root) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const status = document.querySelector('#media-status');
  const region = root.querySelector('.media-swiper');
  const pause = document.querySelector('#media-pause');
  let swiper, typed;
  let manualPause = motion.matches;
  let typedPaused = motion.matches;
  const reasons = new Set();
  const update = () => {
    if (!swiper) return;
    const stopped = manualPause || motion.matches || document.hidden || reasons.size > 0;
    if (stopped) swiper.autoplay.stop(); else if (!swiper.autoplay.running) swiper.autoplay.start();
    pause.setAttribute('aria-pressed', String(manualPause));
    pause.textContent = manualPause ? 'Увімкнути автогортання' : 'Зупинити автогортання';
    region.dataset.autoplay = stopped ? 'stopped' : 'running';
  };
  if (typeof window.Swiper === 'function') {
    swiper = new window.Swiper(region, {
      loop:true, slidesPerView:1, spaceBetween:20, speed:motion.matches?0:350,
      autoplay:{delay:3500,disableOnInteraction:false,pauseOnMouseEnter:true},
      breakpoints:{768:{slidesPerView:2},1024:{slidesPerView:3}},
      navigation:{prevEl:'#media-prev',nextEl:'#media-next'},
      pagination:{el:'.media-pagination',clickable:true},
      keyboard:{enabled:true,onlyInViewport:true},
      a11y:{prevSlideMessage:'Попередній слайд',nextSlideMessage:'Наступний слайд',paginationBulletMessage:'Перейти до слайда {{index}}',slideLabelMessage:'{{index}} з {{slidesLength}}'},
      on:{init(s){region.dataset.ready='true';region.dataset.active=String(s.realIndex);},slideChange(s){region.dataset.active=String(s.realIndex);}}
    });
    root.querySelector('.media-controls').hidden=false;
    status.textContent='9 матеріалів. Автогортання кожні 3,5 с; наведи курсор або зупини кнопкою.';
    pause.addEventListener('click',()=>{manualPause=!manualPause;update();});
    root.addEventListener('mouseenter',()=>{reasons.add('hover');update();});
    root.addEventListener('mouseleave',()=>{reasons.delete('hover');update();});
    root.addEventListener('focusin',()=>{reasons.add('focus');update();});
    root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){reasons.delete('focus');update();}});
    update();
  } else {
    region.dataset.ready='fallback';
    status.textContent='Слайдер тимчасово недоступний. Усі 9 матеріалів показано сіткою.';
  }
  if (window.Fancybox) {
    window.Fancybox.bind('[data-fancybox="coffee-gallery"]',{
      Carousel:{transition:motion.matches?'none':'fade'},
      Images:{Panzoom:{maxScale:3}},
      Toolbar:{display:{left:['infobar'],middle:[],right:['zoomIn','zoomOut','toggle1to1','close']}},
      on:{ready(){reasons.add('lightbox');swiper?.keyboard.disable();update();},destroy(){reasons.delete('lightbox');swiper?.keyboard.enable();update();}}
    });
    root.dataset.fancybox='ready';
    document.querySelector('#lightbox-status').textContent='Натисни зображення: доступні галерея, масштабування та закриття клавішею Escape.';
  } else root.dataset.fancybox='fallback';
  const typedButton=document.querySelector('#typed-pause');
  if (typeof window.Typed==='function' && !motion.matches) {
    typed=new window.Typed('#media-typed',{strings:['Порівнюй моделі.','Розглядай деталі.','Обирай свій iPhone.'],typeSpeed:55,backSpeed:30,backDelay:1800,loop:true,showCursor:true});
    typedButton.hidden=false;
    typedButton.addEventListener('click',()=>{typedPaused=!typedPaused;typedPaused?typed.stop():typed.start();typedButton.setAttribute('aria-pressed',String(typedPaused));typedButton.setAttribute('aria-label',typedPaused?'Продовжити анімацію тексту':'Зупинити анімацію тексту');});
  }
  document.addEventListener('visibilitychange',()=>{update();if(typed){if(document.hidden||typedPaused)typed.stop();else typed.start();}});
  motion.addEventListener('change',()=>{if(swiper)swiper.params.speed=motion.matches?0:350;update();if(typed && motion.matches){typed.destroy();typed=null;document.querySelector('#media-typed').textContent='Порівнюй моделі. Розглядай деталі. Обирай свій iPhone.';typedButton.hidden=true;}});
  addEventListener('pagehide',e=>{if(e.persisted){reasons.add('hidden');update();if(typed)typed.stop();}else{swiper?.destroy(true,true);typed?.destroy();window.Fancybox?.unbind('[data-fancybox="coffee-gallery"]');}});
  addEventListener('pageshow',()=>{reasons.delete('hidden');update();if(typed&&!typedPaused)typed.start();});
})();
