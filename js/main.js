/* Ray Ro — main.js
   Intro → Lenis smooth scroll → GSAP text-mask reveals → parallax → cursor → players. */
(function () {
  var html = document.documentElement;
  var noMotion = html.classList.contains('no-motion') || html.classList.contains('shot');
  var touch = html.classList.contains('touch');
  var EASE = 'expo.out';

  /* ── clock (Dubai, GST = UTC+4) ── */
  function clock() {
    var el = document.querySelector('[data-clock]'); if (!el) return;
    var d = new Date(Date.now() + (new Date().getTimezoneOffset() + 240) * 60000);
    el.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  clock(); setInterval(clock, 30000);
  var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();

  /* ── Lenis ── */
  var lenis = null;
  if (!noMotion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id === '#') return;
        var target = document.querySelector(id); if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      });
    });
  }

  /* ── reveals ── */
  if (!noMotion && window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero: play once the veil lifts
    function heroIn() {
      var tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.to('.hero [data-reveal]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.2)
        .to('.hero .line__in', { y: 0, duration: 1.1, stagger: 0.09 }, 0.35);
    }

    // Everything else: on enter
    document.querySelectorAll('.section').forEach(function (sec) {
      var lines = sec.querySelectorAll('.line__in');
      var items = sec.querySelectorAll('[data-reveal]');
      ScrollTrigger.create({
        trigger: sec, start: 'top 72%', once: true,
        onEnter: function () {
          gsap.to(lines, { y: 0, duration: 1.0, ease: EASE, stagger: 0.08 });
          gsap.to(items, { opacity: 1, y: 0, duration: 0.85, ease: EASE, stagger: 0.09, delay: 0.15 });
        }
      });
    });

    // Parallax (desktop only)
    if (!touch) {
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        var amt = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var img = el.querySelector('img, video') || el;
        gsap.fromTo(img, { yPercent: -amt * 100 * 0.5 }, {
          yPercent: amt * 100 * 0.5, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      // Hero background slow zoom
      gsap.to('.hero__bg', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__inner', { yPercent: 12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Intro veil
    window.addEventListener('load', function () {
      setTimeout(function () {
        html.classList.remove('is-loading');
        html.classList.add('is-ready');
        setTimeout(heroIn, 350);
      }, 700);
    });
    // Safety: if load never fires (blocked font), still reveal
    setTimeout(function () { if (!html.classList.contains('is-ready')) { html.classList.remove('is-loading'); html.classList.add('is-ready'); heroIn(); } }, 4000);
  } else {
    html.classList.remove('is-loading'); html.classList.add('is-ready');
  }

  /* ── F1 video: play only in view ── */
  var f1v = document.querySelector('.f1__video');
  if (f1v && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { f1v.play().catch(function () {}); } else { f1v.pause(); }
      });
    }, { threshold: 0.2 });
    io.observe(f1v);
    f1v.addEventListener('error', function () { f1v.removeAttribute('src'); }, true);
  }

  /* ── cursor ── */
  var cur = document.querySelector('.cursor'), curLabel = cur && cur.querySelector('.cursor__label');
  if (cur && !touch && !noMotion) {
    var cx = 0, cy = 0, tx = 0, ty = 0, on = false;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; if (!on) { on = true; cur.classList.add('is-on'); } });
    document.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); on = false; });
    (function tick() { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(tick); })();
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { curLabel.textContent = el.getAttribute('data-cursor'); cur.classList.add('is-label'); });
      el.addEventListener('mouseleave', function () { cur.classList.remove('is-label'); });
    });
  }

  /* ── YouTube lightbox ── */
  var lb = document.querySelector('.lightbox'), frame = lb && lb.querySelector('.lightbox__frame');
  function openVideo(id) {
    if (!lb) return;
    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1" title="Ray Ro live set" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    lb.hidden = false; document.body.style.overflow = 'hidden'; if (lenis) lenis.stop();
  }
  function closeVideo() { if (!lb) return; frame.innerHTML = ''; lb.hidden = true; document.body.style.overflow = ''; if (lenis) lenis.start(); }
  document.querySelectorAll('[data-yt]').forEach(function (b) { b.addEventListener('click', function () { openVideo(b.getAttribute('data-yt')); }); });
  if (lb) {
    lb.querySelector('.lightbox__close').addEventListener('click', closeVideo);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeVideo(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });
  }
})();
