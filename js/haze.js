/* Hero fallback: slow desert-haze → golden-hour water, drawn on canvas.
   Runs until a Higgsfield loop (assets/video/hero.mp4) is available and playing. */
(function () {
  var canvas = document.querySelector('.hero__canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: false });
  var reduced = document.documentElement.classList.contains('no-motion');
  var w, h, t = 0, raf, running = true;

  // palette: ink → graphite → sand → a single warm accent glow
  var C = { ink: [14, 14, 13], graphite: [42, 42, 40], sand: [216, 210, 199], accent: [199, 91, 42] };
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    // base
    ctx.fillStyle = rgba(C.ink, 1);
    ctx.fillRect(0, 0, w, h);

    // horizon band: sand light bleeding up from below, breathing slowly
    var hy = h * (0.58 + Math.sin(t * 0.00021) * 0.02);
    var g = ctx.createLinearGradient(0, hy - h * 0.35, 0, hy + h * 0.25);
    g.addColorStop(0, rgba(C.ink, 0));
    g.addColorStop(0.55, rgba(C.sand, 0.10 + Math.sin(t * 0.0003) * 0.02));
    g.addColorStop(0.62, rgba(C.accent, 0.12));
    g.addColorStop(1, rgba(C.ink, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // heat haze: soft drifting ellipses, additive-ish
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 7; i++) {
      var p = i / 7;
      var x = w * (0.15 + 0.7 * ((Math.sin(t * 0.00008 * (1 + p) + i * 1.7) + 1) / 2));
      var y = hy + Math.sin(t * 0.00012 + i * 2.1) * h * 0.06 - p * h * 0.08;
      var rx = w * (0.25 + 0.2 * p), ry = h * (0.06 + 0.04 * p);
      var rg = ctx.createRadialGradient(x, y, 0, x, y, rx);
      var col = i % 3 === 0 ? C.accent : C.sand;
      rg.addColorStop(0, rgba(col, i % 3 === 0 ? 0.045 : 0.03));
      rg.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = rg;
      ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y);
      ctx.beginPath(); ctx.arc(x, y, rx, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';

    // water: faint horizontal ripples below the horizon
    ctx.strokeStyle = rgba(C.sand, 0.045);
    ctx.lineWidth = 1;
    for (var r = 0; r < 26; r++) {
      var yy = hy + r * (h * 0.42 / 26) + Math.sin(t * 0.0004 + r) * 1.5;
      var amp = 2 + r * 0.35;
      ctx.beginPath();
      for (var x2 = 0; x2 <= w; x2 += 24) {
        var y2 = yy + Math.sin(x2 * 0.006 + t * 0.0007 + r * 0.6) * amp;
        x2 === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
  }

  function loop(now) {
    t = now;
    draw();
    if (running && !reduced) raf = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);

  // Hand over to the video loop when it can actually play.
  var v = document.querySelector('.hero__video');
  if (v) {
    v.addEventListener('playing', function () { v.classList.add('is-live'); running = false; cancelAnimationFrame(raf); });
    v.addEventListener('error', function () { v.remove(); }, true);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { running = false; cancelAnimationFrame(raf); }
    else if (!v || !v.classList.contains('is-live')) { running = true; requestAnimationFrame(loop); }
  });
})();
