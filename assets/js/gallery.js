// Enhancements load near the gallery; six ordinary links remain usable offline.
const gallery=document.querySelector('#product-gallery');
if(gallery){
 const section=gallery.closest('section'),status=document.querySelector('#gallery-status'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let initialized=false;
 async function enhance(){
  if(initialized)return;initialized=true;
  let swiper=null,manualPause=true,lightbox=false,hover=false,focus=false;
  const button=document.querySelector('#gallery-pause');
  function sync(){
   const paused=manualPause||motion.matches||document.hidden||lightbox||hover||focus;
   if(swiper){swiper.params.speed=motion.matches?0:350;if(paused)swiper.autoplay.stop();else swiper.autoplay.start();}
   button.setAttribute('aria-pressed',String(manualPause||motion.matches));button.textContent=manualPause?'Увімкнути автогортання':'Зупинити автогортання';
   button.disabled=motion.matches;if(motion.matches)button.textContent='Автогортання вимкнено: менше руху';
  }
  try{
   const {default:Swiper}=await import('https://cdn.jsdelivr.net/npm/swiper@12.2.0/swiper-bundle.min.mjs');
   swiper=new Swiper(gallery,{slidesPerView:1,spaceBetween:20,speed:motion.matches?0:350,rewind:true,watchSlidesProgress:true,
    breakpoints:{768:{slidesPerView:2},1024:{slidesPerView:3}},autoplay:{delay:4500,disableOnInteraction:false},
    navigation:{prevEl:'#gallery-prev',nextEl:'#gallery-next'},pagination:{el:'#gallery-pagination',clickable:true},
    a11y:{prevSlideMessage:'Попереднє зображення',nextSlideMessage:'Наступне зображення',paginationBulletMessage:'Перейти до зображення {{index}}',slideLabelMessage:'{{index}} з {{slidesLength}}'},
    on:{slideChange(s){status.textContent=`Починаючи із зображення ${s.activeIndex+1} з 6`;},setTranslate(s){s.slides.forEach(slide=>{const a=slide.querySelector('a');if(a)a.tabIndex=slide.classList.contains('swiper-slide-visible')?0:-1;});}}});
   sync();document.querySelector('.gallery-controls').hidden=false;status.textContent='Шість ШІ-концепцій. Стрілки — гортання, Enter — відкрити.';
   button.addEventListener('click',()=>{manualPause=!manualPause;sync();});
   section.addEventListener('mouseenter',()=>{hover=true;sync();});section.addEventListener('mouseleave',()=>{hover=false;sync();});
   section.addEventListener('focusin',()=>{focus=true;sync();});section.addEventListener('focusout',e=>{focus=section.contains(e.relatedTarget);sync();});
   gallery.addEventListener('keydown',e=>{if(lightbox)return;if(e.key==='ArrowRight'){e.preventDefault();swiper.slideNext();}if(e.key==='ArrowLeft'){e.preventDefault();swiper.slidePrev();}});
   document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
   addEventListener('pagehide',()=>swiper?.autoplay.stop());addEventListener('pageshow',sync);
  }catch{status.textContent='Слайдер недоступний. Усі шість зображень доступні списком.';}
  try{
   const css=document.createElement('link');css.rel='stylesheet';css.href='https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.css';
   await new Promise((resolve,reject)=>{css.onload=resolve;css.onerror=reject;document.head.append(css);});
   await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});
   window.Fancybox.bind('[data-fancybox="iphone-concepts"]',{animated:!motion.matches,Images:{zoom:!motion.matches},Carousel:{transition:motion.matches?false:'slide'},Hash:false,placeFocusBack:true, Slideshow:false, Thumbs:false, Toolbar:{display:{left:["infobar"],middle:[],right:["close"]}},
    l10n:{CLOSE:'Закрити',NEXT:'Наступне',PREV:'Попереднє',MODAL:'Перегляд зображень; Escape — закрити'},
    on:{init(){lightbox=true;sync();},destroy(){lightbox=false;sync();}}});
  }catch{status.textContent+=' Повнорозмірні зображення відкриваються звичайними посиланнями.';}
 }
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();enhance();}},{rootMargin:'300px'});observer.observe(gallery);}else enhance();
}
