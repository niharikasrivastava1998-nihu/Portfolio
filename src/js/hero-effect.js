// =============================================
// HERO EFFECT — Liquid Glass Reveal
// Sharp organic blob with fluid cursor tracking
// =============================================

export class HeroEffect {
  constructor() {
    this.portrait = document.getElementById('heroPortrait');
    this.portraitInner = document.getElementById('heroPortraitInner');
    this.imgElement = this.portraitInner?.querySelector('.hero-portrait-img');

    if (!this.portrait || !this.portraitInner || !this.imgElement) return;

    this.rawMouse = { x: 0.5, y: 0.5 };
    this.mouse = { x: 0.5, y: 0.5 };
    this.slowMouse = { x: 0.5, y: 0.5 };
    this.isHovering = false;
    this.isMobile = window.innerWidth < 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.rafId = null;

    this.blobRadius = 0;
    this.targetBlobRadius = 0;
    this.blobScale = 0;

    this.revealCanvas = null;
    this.revealCtx = null;
    this.sourceImg = null;
    this.doodleImg = null;
    this.imgLoaded = false;
    this.doodleLoaded = false;
    this.revealBuffer = null;

    this.init();
  }

  init() {
    if (this.isMobile || this.prefersReducedMotion) {
      this.bindMobileEvents();
      return;
    }
    this.setupCanvas();
    this.loadAssets();
    this.bindEvents();
  }

  bindMobileEvents() {
    if (!this.portrait) return;
    this.portrait.addEventListener('touchstart', () => {
      this.portraitInner.style.transition = 'transform 0.3s ease-out';
      this.portraitInner.style.transform = 'scale(1.03)';
    }, { passive: true });
    this.portrait.addEventListener('touchend', () => {
      this.portraitInner.style.transform = 'scale(1)';
    });
  }

  setupCanvas() {
    this.revealCanvas = document.createElement('canvas');
    this.revealCanvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      z-index: 3;
      pointer-events: none;
    `;
    this.portraitInner.appendChild(this.revealCanvas);
    this.revealCtx = this.revealCanvas.getContext('2d');
  }

  loadAssets() {
    let loaded = 0;
    const onReady = () => {
      loaded++;
      if (loaded === 2) {
        this.imgLoaded = true;
        this.doodleLoaded = true;
        this.resizeCanvas();
        this.buildRevealBuffer();
        this.animate(0);
      }
    };

    this.sourceImg = new Image();
    this.sourceImg.crossOrigin = 'anonymous';
    this.sourceImg.onload = onReady;
    this.sourceImg.src = this.imgElement.src;

    this.doodleImg = new Image();
    this.doodleImg.crossOrigin = 'anonymous';
    this.doodleImg.onload = onReady;
    this.doodleImg.src = './images/doodle-overlay.png';
  }

  resizeCanvas() {
    if (!this.revealCanvas || !this.sourceImg) return;
    const rect = this.portraitInner.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = Math.min(dpr, 800 / rect.width);
    this.canvasW = Math.floor(rect.width * scale);
    this.canvasH = Math.floor(rect.height * scale);
    this.revealCanvas.width = this.canvasW;
    this.revealCanvas.height = this.canvasH;
    if (this.imgLoaded && this.doodleLoaded) this.buildRevealBuffer();
  }

  // ===== REVEAL BUFFER: portrait + doodle composite =====
  buildRevealBuffer() {
    this.revealBuffer = document.createElement('canvas');
    this.revealBuffer.width = this.canvasW;
    this.revealBuffer.height = this.canvasH;
    const ctx = this.revealBuffer.getContext('2d');
    const w = this.canvasW;
    const h = this.canvasH;

    // Base portrait with warm golden color grade
    ctx.drawImage(this.sourceImg, 0, 0, w, h);

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(255, 220, 150, 0.22)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';

    // Vignette
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.65);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(0.6, 'rgba(0,0,0,0.1)');
    vig.addColorStop(1, 'rgba(12,18,32,0.35)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // Doodle overlay — screen blend makes black transparent
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.88;
    ctx.drawImage(this.doodleImg, 0, 0, w, h);
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ===== EVENTS =====
  bindEvents() {
    this.portrait.addEventListener('mousemove', (e) => {
      const rect = this.portrait.getBoundingClientRect();
      this.rawMouse.x = (e.clientX - rect.left) / rect.width;
      this.rawMouse.y = (e.clientY - rect.top) / rect.height;
    }, { passive: true });

    this.portrait.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.targetBlobRadius = Math.min(this.canvasW, this.canvasH) * 0.28;
    });

    this.portrait.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.rawMouse.x = this.mouse.x;
      this.rawMouse.y = this.mouse.y;
      this.targetBlobRadius = 0;
    });

    // Touch
    this.portrait.addEventListener('touchstart', (e) => {
      this.isHovering = true;
      this.targetBlobRadius = Math.min(this.canvasW, this.canvasH) * 0.32;
      const touch = e.touches[0];
      const rect = this.portrait.getBoundingClientRect();
      this.rawMouse.x = (touch.clientX - rect.left) / rect.width;
      this.rawMouse.y = (touch.clientY - rect.top) / rect.height;
    }, { passive: true });

    this.portrait.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = this.portrait.getBoundingClientRect();
      this.rawMouse.x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
      this.rawMouse.y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
    }, { passive: true });

    this.portrait.addEventListener('touchend', () => {
      this.isHovering = false;
      this.targetBlobRadius = 0;
    });

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      this.resizeCanvas();
    }, { passive: true });
  }

  // ===== ANIMATION LOOP =====
  animate(timestamp) {
    // Fluid mouse interpolation
    const fastLerp = 0.14;
    const slowLerp = 0.04;

    this.mouse.x += (this.rawMouse.x - this.mouse.x) * fastLerp;
    this.mouse.y += (this.rawMouse.y - this.mouse.y) * fastLerp;
    this.slowMouse.x += (this.rawMouse.x - this.slowMouse.x) * slowLerp;
    this.slowMouse.y += (this.rawMouse.y - this.slowMouse.y) * slowLerp;

    // Spring physics for blob radius
    this.blobRadius += (this.targetBlobRadius - this.blobRadius) * 0.08;

    // Smooth blob visibility
    const targetScale = this.isHovering ? 1 : 0;
    this.blobScale += (targetScale - this.blobScale) * 0.07;

    this.updateTilt();
    this.renderSharpBlob(timestamp);

    this.rafId = requestAnimationFrame((t) => this.animate(t));
  }

  updateTilt() {
    const maxTilt = this.isHovering ? 6 : 0.5;
    const tiltX = (this.slowMouse.y - 0.5) * -maxTilt;
    const tiltY = (this.slowMouse.x - 0.5) * maxTilt;
    const s = this.isHovering ? 1.02 : 1;
    this.portraitInner.style.transform =
      `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${s})`;
  }

  // ===== SHARP ORGANIC BLOB REVEAL =====
  // Clean clip path with organic wobble — NOT a gradient mask
  renderSharpBlob(timestamp) {
    if (!this.revealCtx || !this.revealBuffer) return;

    const ctx = this.revealCtx;
    const w = this.canvasW;
    const h = this.canvasH;

    ctx.clearRect(0, 0, w, h);
    if (this.blobScale < 0.01) return;

    const mx = this.mouse.x * w;
    const my = this.mouse.y * h;
    const r = this.blobRadius * this.blobScale;
    const time = timestamp * 0.001;

    if (r < 2) return;

    // ===== Organic blob clip path =====
    ctx.save();
    ctx.beginPath();
    const pts = 72;
    for (let i = 0; i <= pts; i++) {
      const angle = (i / pts) * Math.PI * 2;
      // Smooth organic wobble — slower, subtler
      const w1 = Math.sin(angle * 3 + time * 1.6) * r * 0.04;
      const w2 = Math.sin(angle * 5 - time * 1.2) * r * 0.025;
      const w3 = Math.cos(angle * 2 + time * 2.2) * r * 0.018;
      const cr = r + w1 + w2 + w3;
      const px = mx + Math.cos(angle) * cr;
      const py = my + Math.sin(angle) * cr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.clip();

    // Draw reveal buffer (portrait + doodles) inside blob
    ctx.globalAlpha = this.blobScale;
    ctx.drawImage(this.revealBuffer, 0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.restore();

    // ===== Clean golden edge =====
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const angle = (i / pts) * Math.PI * 2;
      const w1 = Math.sin(angle * 3 + time * 1.6) * r * 0.04;
      const w2 = Math.sin(angle * 5 - time * 1.2) * r * 0.025;
      const w3 = Math.cos(angle * 2 + time * 2.2) * r * 0.018;
      const cr = r + w1 + w2 + w3;
      const px = mx + Math.cos(angle) * cr;
      const py = my + Math.sin(angle) * cr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.globalAlpha = 0.45 * this.blobScale;
    ctx.strokeStyle = 'rgba(212, 175, 55, 1)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.35)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
