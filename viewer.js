// Load WebGL and the official USDZ only after an explicit user action.
const host = document.querySelector('#phone-viewer');
const start = document.querySelector('#viewer-load');
const status = document.querySelector('#viewer-status');
const buttons = [...document.querySelectorAll('[data-view]')];
let ready = false, loading = false;
start.addEventListener('click', async () => {
  if (loading || ready) return;
  loading = true; start.disabled = true; status.textContent = 'Завантаження 3D-моделі…';
  let renderer;
  try {
    const [T, { USDLoader }, { RoomEnvironment }] = await Promise.all([
      import('three'), import('./vendor/three/addons/loaders/USDLoader.js'),
      import('./vendor/three/addons/environments/RoomEnvironment.js')
    ]);
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = T.ACESFilmicToneMapping;
    const scene = new T.Scene();
    const pmrem = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04);
    scene.environment = env.texture; scene.environmentIntensity = 1.2;
    room.dispose(); pmrem.dispose();
    const model = await new USDLoader().loadAsync('./assets/models/iphone-18-pro.usdz', e => {
      if (e.total) status.textContent = `Завантаження 3D-моделі: ${Math.round(e.loaded / e.total * 100)}%`;
    });
    const box = new T.Box3().setFromObject(model), size = box.getSize(new T.Vector3());
    if (!Number.isFinite(size.y) || size.y <= 0) throw new Error('Empty model');
    const center = box.getCenter(new T.Vector3());
    model.position.sub(center);
    const pivot = new T.Group(); pivot.add(model); pivot.scale.setScalar(3 / Math.max(size.x, size.y, size.z));
    scene.add(pivot);
    const camera = new T.PerspectiveCamera(34, 1, .01, 100);
    camera.position.z = 6.5;
    let yaw = -.45, pitch = .1, zoom = 1, frame = 0, visible = true;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    host.append(canvas);
    document.querySelector('#viewer-poster').hidden = true;
    start.hidden = true; ready = true; host.dataset.ready = 'true';
    buttons.forEach(b => b.disabled = false);
    const render = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      pivot.rotation.set(pitch, yaw, 0); camera.position.z = 6.5 / zoom;
      renderer.render(scene, camera);
      host.dataset.angle = String(Math.round(yaw * 180 / Math.PI));
      host.dataset.zoom = zoom.toFixed(2);
    };
    const invalidate = () => { if (!frame) frame = requestAnimationFrame(render); };
    const resize = () => {
      const {width, height} = host.getBoundingClientRect();
      renderer.setSize(width, height, false); camera.aspect = width / height;
      camera.updateProjectionMatrix(); invalidate();
    };
    new ResizeObserver(resize).observe(host);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) invalidate(); }).observe(host);
    document.addEventListener('visibilitychange', invalidate);
    const announce = () => { status.textContent = `Обертання ${((Math.round(yaw * 180 / Math.PI) % 360) + 360) % 360}°. Масштаб ${Math.round(zoom * 100)}%.`; };
    const command = action => {
      if (action === 'left') yaw -= Math.PI / 8;
      if (action === 'right') yaw += Math.PI / 8;
      if (action === 'front') { yaw = 0; pitch = 0; }
      if (action === 'back') { yaw = Math.PI; pitch = 0; }
      if (action === 'up') pitch = Math.max(-.65, pitch - .12);
      if (action === 'down') pitch = Math.min(.65, pitch + .12);
      if (action === 'in') zoom = Math.min(1.45, zoom + .1);
      if (action === 'out') zoom = Math.max(.7, zoom - .1);
      if (action === 'reset') { yaw = -.45; pitch = .1; zoom = 1; }
      invalidate(); announce();
    };
    buttons.forEach(b => b.addEventListener('click', () => command(b.dataset.view)));
    host.addEventListener('keydown', e => {
      const action = {ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'in','=':'in','-':'out',Home:'reset'}[e.key];
      if (action) { e.preventDefault(); command(action); }
    });
    let pointer = null;
    canvas.addEventListener('pointerdown', e => {
      if (!e.isPrimary || e.button !== 0) return;
      pointer = {id:e.pointerId, x:e.clientX, y:e.clientY, yaw, pitch};
      canvas.setPointerCapture(e.pointerId); host.focus({preventScroll:true}); host.classList.add('dragging');
    });
    canvas.addEventListener('pointermove', e => {
      if (!pointer || pointer.id !== e.pointerId) return;
      yaw = pointer.yaw + (e.clientX - pointer.x) / host.clientWidth * Math.PI * 2;
      // Vertical touch scrolling stays native; mouse supports a limited tilt.
      if (e.pointerType !== 'touch') pitch = Math.max(-.65, Math.min(.65, pointer.pitch + (e.clientY - pointer.y) * .006));
      invalidate();
    });
    const release = e => {
      if (!pointer || pointer.id !== e.pointerId) return;
      pointer = null; host.classList.remove('dragging'); announce();
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    canvas.addEventListener('pointerup',release); canvas.addEventListener('pointercancel',release); canvas.addEventListener('lostpointercapture',release);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); status.textContent = '3D-контекст втрачено. Оновіть сторінку, щоб відновити перегляд.'; buttons.forEach(b => b.disabled = true); });
    resize(); announce(); host.focus({preventScroll:true});
  } catch (error) {
    renderer?.dispose(); loading = false; start.disabled = false;
    status.textContent = '3D не вдалося відкрити. Перевірте підтримку WebGL та з’єднання, потім спробуйте ще раз. Фото залишається доступним.';
    console.error('iPhone 360:', error);
  }
});
