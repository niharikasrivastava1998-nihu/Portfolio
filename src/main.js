/* =============================================
   MAIN.JS — Portfolio V2
   Niharika's "Luminous Flow" Portfolio
   ============================================= */

// ===== WAIT FOR GSAP =====
function waitForGSAP() {
  return new Promise((resolve) => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      resolve();
    } else {
      const check = setInterval(() => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          clearInterval(check);
          resolve();
        }
      }, 50);
    }
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileViewport() {
  return window.innerWidth < 768;
}

function hasConstrainedDevice() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return Boolean(
    prefersReducedMotion() ||
    isMobileViewport() ||
    connection?.saveData ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4)
  );
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast visible ${type}`;
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// ===== DEFAULT JOURNAL ENTRIES =====
const DEFAULT_JOURNAL_ENTRIES = [
  {
    id: 'j1',
    title: 'Letters to the Universe',
    category: 'reflection',
    excerpt: "Some conversations are not meant for people. They're meant for the sky, the wind, and the infinite silence between stars.",
    content: "Some conversations are not meant for people. They're meant for the sky, the wind, and the infinite silence between stars. Here's one such letter I wrote on a quiet evening in Pune...\n\nDear Universe,\n\nI've been thinking about how strange it is to grow. Not the kind of growing that adds inches to your frame, but the kind that shifts something deep inside — like tectonic plates rearranging themselves quietly, without anyone noticing.\n\nToday, I realized that I've been holding onto a version of myself that no longer exists. She was afraid to speak, afraid to take up space, afraid of her own voice. But I'm not her anymore.\n\nI am the woman who writes. The woman who believes. The woman who continues.\n\nWith love and surrender,\nNiharika",
    date: 'March 2026',
    readTime: '4 min read'
  },
  {
    id: 'j2',
    title: 'Bloom',
    category: 'poetry',
    excerpt: "She grew through the cracks, not despite them — because of them.",
    content: "She grew through the cracks,\nnot despite them —\nbecause of them.\n\nEvery wound became a window,\nevery scar a story worth telling.\n\nShe didn't bloom in spite of the storm.\nShe bloomed because she learned\nto dance in the rain.\n\nAnd when they asked her\nhow she survived,\nshe smiled and whispered:\n\n\"I didn't survive.\nI became.\"",
    date: 'Feb 2026',
    readTime: '2 min read'
  },
  {
    id: 'j3',
    title: 'The Space Between Breaths',
    category: 'spiritual',
    excerpt: "In meditation, I found the universe isn't out there — it lives in the space between your thoughts.",
    content: "In meditation, I found the universe isn't out there — it lives in the space between your thoughts.\n\nThere's a moment, right after you exhale and before the next breath begins, where everything is still. Not quiet — still. There's a difference.\n\nQuiet is the absence of noise. Stillness is the presence of everything.\n\nIn that tiny gap, I've met God. Not the God of temples and textbooks, but the one who sits quietly in your chest, waiting for you to notice.\n\nOm Namah Shivaya.\n\nThe mantra isn't just words. It's a homecoming.",
    date: 'Jan 2026',
    readTime: '3 min read'
  },
  {
    id: 'j4',
    title: 'Unfinished',
    category: 'prose',
    excerpt: "We are all unfinished stories — and that's the most beautiful thing about being alive.",
    content: "We are all unfinished stories — and that's the most beautiful thing about being alive.\n\nI used to be afraid of the ellipsis. Those three dots at the end of a sentence that refuse to give you closure. But now I understand — the ellipsis is not about what's missing. It's about what's still possible.\n\nEvery 'to be continued' is a promise. A whisper from the universe saying: \"There's more. Stay.\"\n\nSo I stay. I write. I believe in the chapters yet to come.",
    date: 'Dec 2025',
    readTime: '3 min read'
  },
  {
    id: 'j5',
    title: 'Morning Pages',
    category: 'reflection',
    excerpt: "Every morning, before the world wakes up, I write three pages. Raw, unfiltered, honest.",
    content: "Every morning, before the world wakes up, I write three pages. Raw, unfiltered, honest.\n\nNo editing. No second-guessing. Just letting the words fall where they want to.\n\nSome mornings, the pages are full of gratitude. Others, they're full of fear. But every morning, they remind me of one truth:\n\nI am a writer. Not because I publish. Not because anyone reads. But because I cannot stop the words from coming.\n\nThey arrive like guests I didn't invite but am always glad to see.",
    date: 'Nov 2025',
    readTime: '3 min read'
  },
  {
    id: 'j6',
    title: 'The River of Letting Go',
    category: 'spiritual',
    excerpt: "By the banks of the Ganges, I learned that letting go isn't losing — it's returning.",
    content: "By the banks of the Ganges, I learned that letting go isn't losing — it's returning.\n\nThe river doesn't hold onto the leaves that fall into it. It carries them, tumbles them, and eventually releases them to the ocean. The river doesn't grieve what it lets go. It simply flows.\n\nHar Har Mahadev.\n\nLike the river, I'm learning to carry without clinging. To love without possessing. To flow without knowing where I'm going.\n\nBecause faith isn't about knowing the destination. It's about trusting the current.",
    date: 'Oct 2025',
    readTime: '4 min read'
  }
];

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas || hasConstrainedDevice()) {
      if (this.canvas) this.canvas.style.display = 'none';
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.isVisible = true;
    this.rafId = null;
    this.resizeRaf = null;
    this.particleCount = window.innerWidth < 1200 ? 60 : 90;
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.6 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: this.getRandomColor(),
        glowRadius: Math.random() * 4 + 2,
      });
    }
  }

  getRandomColor() {
    const colors = [
      '255, 107, 53',    // Saffron 🔥
      '212, 175, 55',    // Gold ✦
      '245, 208, 99',    // Light Gold
      '30, 58, 138',     // Deep Blue (Neelkanth)
      '99, 102, 241',    // Indigo
      '183, 148, 246',   // Lavender
      '236, 72, 153',    // Rose
      '13, 148, 136',    // Teal
      '255, 255, 255',   // White star
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      cancelAnimationFrame(this.resizeRaf);
      this.resizeRaf = requestAnimationFrame(() => {
        this.resize();
        this.particleCount = window.innerWidth < 1200 ? 60 : 90;
        this.createParticles();
      });
    }, { passive: true });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible && !this.rafId) {
        this.animate();
      }
    });
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const opacity = (1 - distance / 100) * 0.06;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (!this.isVisible) {
      this.rafId = null;
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const time = Date.now() * 0.001;

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Mouse repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0 && dist < 120) {
        const force = (120 - dist) / 120;
        p.x -= (dx / dist) * force * 0.4;
        p.y -= (dy / dist) * force * 0.4;
      }

      // Wrap edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Twinkle
      const twinkle = Math.sin(time * p.twinkleSpeed * 10 + p.twinkleOffset) * 0.5 + 0.5;
      const currentOpacity = p.opacity * twinkle;

      // Draw glow
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
      gradient.addColorStop(0, `rgba(${p.color}, ${currentOpacity})`);
      gradient.addColorStop(1, `rgba(${p.color}, 0)`);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Draw core
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${currentOpacity * 1.2})`;
      this.ctx.fill();
    });

    this.connectParticles();
    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

// ===== CUSTOM CURSOR =====
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('customCursor');
    if (!this.cursor || isMobileViewport() || prefersReducedMotion()) return;
    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    });

    const interactiveElements = document.querySelectorAll(
      'a, button, .glass-card, .filter-btn, .social-link, [data-magnetic], input, textarea, .journal-card'
    );
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovering'));
    });
  }

  animate() {
    this.pos.x += (this.target.x - this.pos.x) * 0.15;
    this.pos.y += (this.target.y - this.pos.y) * 0.15;
    this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    requestAnimationFrame(() => this.animate());
  }
}

// ===== NAVIGATION =====
class Navigation {
  constructor() {
    this.nav = document.getElementById('mainNav');
    this.toggle = document.getElementById('navToggle');
    this.links = document.getElementById('navLinks');
    this.logo = document.getElementById('navLogo');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section');
    this.scrollTicking = false;
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.handleWindowScroll(), { passive: true });

    if (this.toggle) {
      this.toggle.addEventListener('click', () => {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('open');
      });
    }

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.toggle?.classList.remove('active');
        this.links?.classList.remove('open');
      });
    });

    this.logo?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle?.classList.remove('active');
      this.links?.classList.remove('open');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    this.handleWindowScroll();
  }

  handleWindowScroll() {
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      this.handleScroll();
      this.updateActiveLink();
      this.scrollTicking = false;
    });
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  updateActiveLink() {
    let current = '';
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || hasConstrainedDevice()) return;
    const counters = document.querySelectorAll('.stat-number[data-target]');

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.nextElementSibling?.textContent || '';

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = Math.floor(obj.val);
            }
          });
        }
      });
    });
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || hasConstrainedDevice()) return;
    gsap.registerPlugin(ScrollTrigger);

    this.animateHero();
    this.animateSections();
    this.animateTimeline();
    this.animateJournal();
    this.animateBook();
    this.animateProjects();
    this.animateAwards();
    this.animateConnect();

    setTimeout(() => ScrollTrigger.refresh(), 300);
  }

  animateHero() {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from('.hero-greeting-line', {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
    })
    .from('.hero-name-line', {
      y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out'
    }, '-=0.3')
    .from('.tagline-word, .tagline-dot', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
    }, '-=0.4')
    .from('.hero-description', {
      y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-cta .btn', {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
    }, '-=0.3')
    .from('.scroll-indicator', {
      y: 20, opacity: 0, duration: 0.6, ease: 'power2.out'
    }, '-=0.2');
  }

  animateSections() {
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.section-divider').forEach(div => {
      gsap.fromTo(div,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: div, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.fromTo('.about-intro',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-intro', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );

    gsap.utils.toArray('.about-body').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: i * 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: '.about-content-col', start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.stat-card').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.about-stats', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.skill-tag').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, delay: i * 0.03, ease: 'power2.out',
          scrollTrigger: { trigger: '.skills-tags', start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.fromTo('.about-image-frame',
      { x: -40, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-image-col', start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  animateTimeline() {
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(item,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: i * 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.fromTo('.timeline-line',
      { scaleY: 0 },
      { scaleY: 1, transformOrigin: 'top center',
        scrollTrigger: { trigger: '.timeline', start: 'top 80%', end: 'bottom 30%', scrub: 1 }
      }
    );
  }

  animateJournal() {
    gsap.utils.toArray('.journal-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.journal-grid', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.filter-btn').forEach((btn, i) => {
      gsap.fromTo(btn,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: '.journal-filters', start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  animateBook() {
    gsap.fromTo('.book-3d',
      { x: -60, opacity: 0, rotateY: -30 },
      { x: 0, opacity: 1, rotateY: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.book-showcase', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );

    gsap.utils.toArray('.book-info > *').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: i * 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: '.book-info', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  animateProjects() {
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.projects-bento', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  animateAwards() {
    gsap.utils.toArray('.award-card').forEach((card, i) => {
      gsap.fromTo(card,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.awards-carousel', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  animateConnect() {
    gsap.utils.toArray('.connect-card').forEach((card, i) => {
      gsap.fromTo(card,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, delay: i * 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: '.connect-info', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.social-link').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.connect-social', start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    gsap.utils.toArray('.form-group').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: i * 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: '.connect-form', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });
  }
}

// ===== JOURNAL SYSTEM =====
class JournalSystem {
  constructor() {
    this.filtersContainer = document.getElementById('journalFilters');
    this.gridContainer = document.getElementById('journalGrid');
    this.modal = document.getElementById('journalModal');
    this.modalClose = document.getElementById('modalClose');

    if (!this.gridContainer) return;

    this.entries = this.loadEntries();
    this.categories = this.getCategories();
    this.renderFilters();
    this.renderCards();
    this.bindEvents();
  }

  loadEntries() {
    const stored = localStorage.getItem('niharika_journal_entries');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch (e) { /* fallback to defaults */ }
    }
    // Store defaults
    localStorage.setItem('niharika_journal_entries', JSON.stringify(DEFAULT_JOURNAL_ENTRIES));
    return [...DEFAULT_JOURNAL_ENTRIES];
  }

  getCategories() {
    const cats = new Set(this.entries.map(e => e.category));
    return ['all', ...Array.from(cats)];
  }

  renderFilters() {
    if (!this.filtersContainer) return;
    this.filtersContainer.innerHTML = '';
    this.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-btn${cat === 'all' ? ' active' : ''}`;
      btn.setAttribute('data-filter', cat);
      btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      this.filtersContainer.appendChild(btn);
    });
  }

  renderCards(filter = 'all') {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = '';
    const filtered = filter === 'all' ? this.entries : this.entries.filter(e => e.category === filter);

    filtered.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'journal-card glass-card';
      card.setAttribute('data-category', entry.category);
      card.setAttribute('data-id', entry.id);
      card.innerHTML = `
        <span class="journal-tag">${entry.category}</span>
        <h3 class="journal-title">${entry.title}</h3>
        <p class="journal-excerpt">${entry.excerpt}</p>
        <div class="journal-meta">
          <span>${entry.date}</span>
          <span>${entry.readTime}</span>
        </div>
        <span class="journal-read-more">Read more →</span>
      `;
      card.addEventListener('click', () => this.openModal(entry));
      this.gridContainer.appendChild(card);
    });
  }

  openModal(entry) {
    if (!this.modal) return;
    document.getElementById('modalTag').textContent = entry.category;
    document.getElementById('modalTitle').textContent = entry.title;
    document.getElementById('modalDate').textContent = entry.date;
    document.getElementById('modalReadTime').textContent = entry.readTime;
    document.getElementById('modalBody').innerHTML = entry.content.split('\n\n').map(p => `<p>${p}</p>`).join('');
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  bindEvents() {
    // Filter buttons
    this.filtersContainer?.addEventListener('click', (e) => {
      if (!e.target.classList.contains('filter-btn')) return;
      this.filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      this.renderCards(e.target.getAttribute('data-filter'));
    });

    // Close modal
    this.modalClose?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }
}

// ===== AWARDS CAROUSEL =====
class AwardsCarousel {
  constructor() {
    this.track = document.querySelector('.awards-track');
    this.cards = document.querySelectorAll('.award-card');
    this.prevBtn = document.getElementById('carouselPrev');
    this.nextBtn = document.getElementById('carouselNext');
    this.dotsContainer = document.getElementById('carouselDots');
    this.currentIndex = 0;
    this.cardsPerView = this.getCardsPerView();

    if (!this.track || this.cards.length === 0) return;

    this.createDots();
    this.bindEvents();
    this.updateCarousel();
  }

  getCardsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  createDots() {
    if (!this.dotsContainer) return;
    const totalDots = Math.ceil(this.cards.length / this.cardsPerView);
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    window.addEventListener('resize', () => {
      this.cardsPerView = this.getCardsPerView();
      this.createDots();
      this.currentIndex = 0;
      this.updateCarousel();
    });

    let startX = 0, isDragging = false;
    this.track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; });
    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
      isDragging = false;
    });
  }

  prev() { if (this.currentIndex > 0) { this.currentIndex--; this.updateCarousel(); } }
  next() {
    const maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
    if (this.currentIndex < maxIndex) { this.currentIndex++; this.updateCarousel(); }
  }

  goTo(index) {
    this.currentIndex = Math.min(index * this.cardsPerView, Math.max(0, this.cards.length - this.cardsPerView));
    this.updateCarousel();
  }

  updateCarousel() {
    const cardWidth = this.cards[0]?.offsetWidth || 320;
    const gap = 24;
    this.track.style.transform = `translateX(-${this.currentIndex * (cardWidth + gap)}px)`;
    const dots = this.dotsContainer?.querySelectorAll('.carousel-dot') || [];
    const activeDot = Math.floor(this.currentIndex / this.cardsPerView);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === activeDot));
  }
}

// ===== CONTACT FORM (EmailJS) =====
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;
    this.submitBtn = document.getElementById('submitBtn');
    this.formStatus = document.getElementById('formStatus');

    // EmailJS config — user needs to fill these in
    this.emailjsPublicKey = 'YOUR_PUBLIC_KEY';
    this.emailjsServiceId = 'YOUR_SERVICE_ID';
    this.emailjsTemplateId = 'YOUR_TEMPLATE_ID';

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async loadEmailJS() {
    if (window.emailjs) return window.emailjs;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.async = true;
      script.onload = () => resolve(window.emailjs);
      script.onerror = () => reject(new Error('EmailJS failed to load'));
      document.head.appendChild(script);
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const btnSpan = this.submitBtn.querySelector('span');
    const originalText = btnSpan.textContent;

    btnSpan.textContent = 'Sending...';
    this.submitBtn.disabled = true;

    // Check if EmailJS is configured
    if (this.emailjsPublicKey === 'YOUR_PUBLIC_KEY') {
      // Fallback: mailto link
      const name = this.form.elements.from_name.value;
      const email = this.form.elements.from_email.value;
      const message = this.form.elements.message.value;
      const params = new URLSearchParams({
        subject: `Portfolio Contact from ${name}`,
        body: `From: ${name} (${email})\n\n${message}`,
      });
      window.location.href = `mailto:niharikarivastava1998@gmail.com?${params.toString()}`;
      showToast('Opening email client...', 'success');
      btnSpan.textContent = 'Message Sent ✨';
      this.form.reset();
      setTimeout(() => { btnSpan.textContent = originalText; this.submitBtn.disabled = false; }, 3000);
      return;
    }

    try {
      await this.loadEmailJS();
      await emailjs.send(this.emailjsServiceId, this.emailjsTemplateId, {
        from_name: this.form.elements.from_name.value,
        from_email: this.form.elements.from_email.value,
        message: this.form.elements.message.value,
      }, this.emailjsPublicKey);

      showToast('Message sent successfully! ✨', 'success');
      btnSpan.textContent = 'Message Sent ✨';
      this.form.reset();
    } catch (error) {
      showToast('Something went wrong. Please try email directly.', 'error');
      btnSpan.textContent = 'Try Again';
    }

    setTimeout(() => { btnSpan.textContent = originalText; this.submitBtn.disabled = false; }, 3000);
  }
}

// ===== MAGNETIC HOVER =====
class MagneticHover {
  constructor() {
    if (isMobileViewport() || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    this.elements = document.querySelectorAll('[data-magnetic]');
    this.bind();
  }

  bind() {
    this.elements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      el.addEventListener('mouseenter', () => { el.style.transition = 'none'; });
    });
  }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
      });
    });
  }
}

// ===== CONSTELLATION DEFENDER =====
class CosmosGame {
  constructor() {
    this.overlay = document.getElementById('cosmosGame');
    this.siteShell = document.getElementById('siteShell');
    this.trigger = document.getElementById('cosmosTrigger');
    this.closeBtn = document.getElementById('cosmosClose');
    this.startBtn = document.getElementById('cosmosStart');
    this.canvas = document.getElementById('cosmosCanvas');
    this.statusEl = document.getElementById('cosmosStatus');
    this.scoreEl = document.getElementById('cosmosScore');
    this.livesEl = document.getElementById('cosmosLives');
    this.waveEl = document.getElementById('cosmosWave');
    this.leftBtn = document.getElementById('cosmosLeft');
    this.rightBtn = document.getElementById('cosmosRight');
    this.fireBtn = document.getElementById('cosmosFire');

    if (!this.overlay || !this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.rafId = null;
    this.transitionTimer = null;
    this.active = false;
    this.running = false;
    this.keys = { left: false, right: false };
    this.lastShotAt = 0;
    this.mobileMotion = false;
    this.motionEnabled = false;
    this.motionPermissionAsked = false;
    this.motionTargetX = null;
    this.enemyShots = [];
    this.barriers = [];
    this.enemyCooldown = 0;
    this.pointerActive = false;
    this.boundOrientationHandler = null;
    this.warpTargets = [];

    this.bindEvents();
    this.reset();
    this.render();
  }

  bindEvents() {
    this.trigger?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.startBtn?.addEventListener('click', () => this.start());

    document.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (e.key === 'Escape') {
        this.close();
        return;
      }
      if (!this.mobileMotion && e.key === 'ArrowLeft') this.keys.left = true;
      if (!this.mobileMotion && e.key === 'ArrowRight') this.keys.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.fire();
      }
    });

    document.addEventListener('keyup', (e) => {
      if (!this.active) return;
      if (e.key === 'ArrowLeft') this.keys.left = false;
      if (e.key === 'ArrowRight') this.keys.right = false;
    });

    const hold = (button, key) => {
      button?.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.keys[key] = true;
      });
      button?.addEventListener('pointerup', () => { this.keys[key] = false; });
      button?.addEventListener('pointerleave', () => { this.keys[key] = false; });
      button?.addEventListener('pointercancel', () => { this.keys[key] = false; });
    };

    hold(this.leftBtn, 'left');
    hold(this.rightBtn, 'right');
    this.fireBtn?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.fire();
    });

    this.canvas.addEventListener('pointerdown', (e) => this.handleCanvasPointerDown(e));
    this.canvas.addEventListener('pointermove', (e) => this.handleCanvasPointerMove(e));
    this.canvas.addEventListener('pointerup', () => this.handleCanvasPointerUp());
    this.canvas.addEventListener('pointerleave', () => this.handleCanvasPointerUp());
    this.canvas.addEventListener('pointercancel', () => this.handleCanvasPointerUp());
  }

  open() {
    if (this.active) return;
    this.prepareWarpTargets();
    this.overlay.classList.remove('active');
    this.overlay.classList.remove('opening');
    this.overlay.classList.add('preparing');
    document.body.classList.add('cosmos-transitioning');
    clearTimeout(this.transitionTimer);
    this.transitionTimer = window.setTimeout(() => {
      this.overlay.classList.remove('preparing');
      this.overlay.classList.add('active');
      requestAnimationFrame(() => this.overlay.classList.add('opening'));
      this.overlay.setAttribute('aria-hidden', 'false');
      this.active = true;
      this.setStatus('Warp corridor aligned. Tap start to begin.');
      this.render();
    }, 460);
  }

  close() {
    clearTimeout(this.transitionTimer);
    this.overlay.classList.remove('opening');
    this.overlay.classList.remove('preparing');
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.active = false;
    this.running = false;
    this.keys.left = false;
    this.keys.right = false;
    this.pointerActive = false;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.setStatus('Transmission paused.');
    setTimeout(() => {
      document.body.classList.remove('cosmos-transitioning');
      this.clearWarpTargets();
    }, 260);
    this.render();
  }

  prepareWarpTargets() {
    this.clearWarpTargets();
    if (!this.siteShell) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const selector = [
      '.nav-logo',
      '.nav-link',
      '.hero-greeting-line',
      '.hero-name-line',
      '.tagline-word',
      '.tagline-dot',
      '.hero-description',
      '.hero-cta .btn',
      '.scroll-indicator',
      '.section-label',
      '.section-title',
      '.section-subtitle',
      '.about-intro',
      '.about-body',
      '.about-signature',
      '.work-principle',
      '.stat-card',
      '.skill-tag',
      '.timeline-item',
      '.journal-card',
      '.filter-btn',
      '.book-visual',
      '.book-info > *',
      '.project-card',
      '.award-card',
      '.connect-card',
      '.social-link',
      '.connect-form',
      '.footer-quote',
      '.footer-links a',
      '.footer-secret-link',
      '.footer-bottom'
    ].join(', ');

    const targets = Array.from(this.siteShell.querySelectorAll(selector))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight &&
          rect.right > 0 &&
          rect.left < window.innerWidth;
      })
      .slice(0, 64);

    targets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const itemCenterY = rect.top + rect.height / 2;
      const deltaX = centerX - itemCenterX;
      const deltaY = centerY - itemCenterY;
      const distance = Math.hypot(deltaX, deltaY);
      const delay = Math.min(180, distance * 0.08);
      const rotation = ((deltaX / Math.max(window.innerWidth, 1)) * 18).toFixed(2);

      element.style.setProperty('--warp-x', `${deltaX.toFixed(1)}px`);
      element.style.setProperty('--warp-y', `${deltaY.toFixed(1)}px`);
      element.style.setProperty('--warp-delay', `${delay.toFixed(0)}ms`);
      element.style.setProperty('--warp-rotate', `${rotation}deg`);
      element.classList.add('warp-target');
    });

    this.warpTargets = targets;
  }

  clearWarpTargets() {
    this.warpTargets.forEach((element) => {
      element.classList.remove('warp-target');
      element.style.removeProperty('--warp-x');
      element.style.removeProperty('--warp-y');
      element.style.removeProperty('--warp-delay');
      element.style.removeProperty('--warp-rotate');
    });
    this.warpTargets = [];
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.player = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 40,
      width: 28,
      height: 18,
      speed: 4.2
    };
    this.bullets = [];
    this.enemyShots = [];
    this.invaders = [];
    this.invaderDirection = 1;
    this.invaderSpeed = 0.38;
    this.invaderDrop = 16;
    this.enemyCooldown = 1000;
    this.stars = Array.from({ length: 48 }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.5 + 0.2
    }));
    this.createBarriers();
    this.syncControls();
    this.spawnWave();
    this.updateHud();
    this.setStatus('Tap start to begin.');
  }

  createBarriers() {
    this.barriers = [70, 140, 210, 280].map((x) => ({
      x,
      y: this.canvas.height - 110,
      width: 34,
      height: 18,
      health: 4
    }));
  }

  spawnWave() {
    this.invaders = [];
    const cols = 6;
    const rows = 3 + Math.min(2, this.wave - 1);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.invaders.push({
          x: 42 + col * 42,
          y: 50 + row * 34,
          width: 18,
          height: 14,
          alive: true,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  async start() {
    this.reset();
    await this.enableMotionControls();
    this.running = true;
    this.setStatus(this.mobileMotion ? 'Tilt to move. Tap fire to defend the signal.' : 'Defend the signal.');
    cancelAnimationFrame(this.rafId);
    this.loop();
  }

  async enableMotionControls() {
    this.mobileMotion = false;
    if (!isMobileViewport()) {
      this.syncControls();
      return;
    }

    if (typeof DeviceOrientationEvent === 'undefined') {
      this.syncControls();
      return;
    }

    const requestPermission = DeviceOrientationEvent.requestPermission?.bind(DeviceOrientationEvent);
    if (requestPermission && !this.motionPermissionAsked) {
      this.motionPermissionAsked = true;
      try {
        const result = await requestPermission();
        if (result !== 'granted') {
          this.syncControls();
          return;
        }
      } catch {
        this.syncControls();
        return;
      }
    }

    if (!this.motionEnabled) {
      this.boundOrientationHandler = (event) => {
        if (!this.active || !this.mobileMotion) return;
        const gamma = Math.max(-25, Math.min(25, event.gamma || 0));
        const normalized = (gamma + 25) / 50;
        this.motionTargetX = normalized * (this.canvas.width - this.player.width) + this.player.width / 2;
      };
      window.addEventListener('deviceorientation', this.boundOrientationHandler, { passive: true });
      this.motionEnabled = true;
    }

    this.mobileMotion = true;
    this.syncControls();
  }

  syncControls() {
    const mobileMode = isMobileViewport() && this.mobileMotion;
    document.querySelector('.cosmos-game-controls')?.classList.toggle('mobile-motion', mobileMode);
  }

  fire() {
    if (!this.running) return;
    const now = performance.now();
    if (now - this.lastShotAt < 220) return;
    this.lastShotAt = now;
    this.bullets.push({
      x: this.player.x,
      y: this.player.y - 12,
      speed: 6
    });
  }

  handleCanvasPointerDown(e) {
    if (!this.active) return;
    if (!this.mobileMotion && e.pointerType === 'mouse') {
      this.updatePointerTarget(e);
    }
    if (e.pointerType !== 'mouse') {
      this.pointerActive = true;
      this.updatePointerTarget(e);
    }
    if (this.running) this.fire();
  }

  handleCanvasPointerMove(e) {
    if (!this.active) return;
    if (this.mobileMotion && e.pointerType !== 'mouse') return;
    if (e.pointerType === 'mouse' || this.pointerActive) {
      this.updatePointerTarget(e);
    }
  }

  handleCanvasPointerUp() {
    this.pointerActive = false;
  }

  updatePointerTarget(e) {
    const rect = this.canvas.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, relativeX));
    this.motionTargetX = clamped * (this.canvas.width - this.player.width) + this.player.width / 2;
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.render();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  update() {
    if (this.mobileMotion && this.motionTargetX !== null) {
      this.player.x += (this.motionTargetX - this.player.x) * 0.12;
    } else {
      if (this.keys.left) this.player.x -= this.player.speed;
      if (this.keys.right) this.player.x += this.player.speed;
    }
    this.player.x = Math.max(this.player.width / 2, Math.min(this.canvas.width - this.player.width / 2, this.player.x));

    this.stars.forEach((star) => {
      star.y += star.speed;
      if (star.y > this.canvas.height) {
        star.y = 0;
        star.x = Math.random() * this.canvas.width;
      }
    });

    this.bullets = this.bullets.filter((bullet) => {
      bullet.y -= bullet.speed;
      return bullet.y > -10;
    });

    this.enemyShots = this.enemyShots.filter((shot) => {
      shot.y += shot.speed;
      return shot.y < this.canvas.height + 10;
    });

    let shouldDrop = false;
    let minX = Infinity;
    let maxX = -Infinity;

    this.invaders.forEach((invader) => {
      if (!invader.alive) return;
      invader.x += this.invaderDirection * this.invaderSpeed;
      invader.y += Math.sin(performance.now() * 0.001 + invader.phase) * 0.02;
      minX = Math.min(minX, invader.x - invader.width / 2);
      maxX = Math.max(maxX, invader.x + invader.width / 2);
    });

    if (minX <= 14 || maxX >= this.canvas.width - 14) {
      this.invaderDirection *= -1;
      shouldDrop = true;
    }

    if (shouldDrop) {
      this.invaders.forEach((invader) => {
        if (invader.alive) invader.y += this.invaderDrop;
      });
    }

    this.handleCollisions();
    this.handleEnemyFire();

    if (this.invaders.every((invader) => !invader.alive)) {
      this.wave += 1;
      this.invaderSpeed += 0.08;
      this.spawnWave();
      this.updateHud();
      this.setStatus(`Wave ${this.wave} incoming.`);
    }

    const breach = this.invaders.some((invader) => invader.alive && invader.y + invader.height / 2 >= this.player.y - 10);
    if (breach) this.loseLife();
  }

  handleCollisions() {
    this.bullets.forEach((bullet) => {
      this.barriers.forEach((barrier) => {
        if (barrier.health <= 0) return;
        const hit =
          bullet.x >= barrier.x - barrier.width / 2 &&
          bullet.x <= barrier.x + barrier.width / 2 &&
          bullet.y >= barrier.y - barrier.height / 2 &&
          bullet.y <= barrier.y + barrier.height / 2;
        if (hit) {
          barrier.health -= 1;
          bullet.y = -100;
        }
      });

      this.invaders.forEach((invader) => {
        if (!invader.alive) return;
        const hit =
          bullet.x >= invader.x - invader.width / 2 &&
          bullet.x <= invader.x + invader.width / 2 &&
          bullet.y >= invader.y - invader.height / 2 &&
          bullet.y <= invader.y + invader.height / 2;
        if (hit) {
          invader.alive = false;
          bullet.y = -100;
          this.score += 10;
          this.updateHud();
        }
      });
    });

    this.enemyShots.forEach((shot) => {
      this.barriers.forEach((barrier) => {
        if (barrier.health <= 0) return;
        const hit =
          shot.x >= barrier.x - barrier.width / 2 &&
          shot.x <= barrier.x + barrier.width / 2 &&
          shot.y >= barrier.y - barrier.height / 2 &&
          shot.y <= barrier.y + barrier.height / 2;
        if (hit) {
          barrier.health -= 1;
          shot.y = this.canvas.height + 100;
        }
      });

      const hitPlayer =
        shot.x >= this.player.x - this.player.width / 2 &&
        shot.x <= this.player.x + this.player.width / 2 &&
        shot.y >= this.player.y - this.player.height / 2 &&
        shot.y <= this.player.y + this.player.height / 2;

      if (hitPlayer) {
        shot.y = this.canvas.height + 100;
        this.loseLife();
      }
    });

    this.bullets = this.bullets.filter((bullet) => bullet.y > -10);
    this.enemyShots = this.enemyShots.filter((shot) => shot.y < this.canvas.height + 20);
  }

  handleEnemyFire() {
    this.enemyCooldown -= 16;
    if (this.enemyCooldown > 0) return;
    const alive = this.invaders.filter((invader) => invader.alive);
    if (!alive.length) return;
    const shooter = alive[Math.floor(Math.random() * alive.length)];
    this.enemyShots.push({
      x: shooter.x,
      y: shooter.y + 12,
      speed: 2.2 + this.wave * 0.2
    });
    this.enemyCooldown = Math.max(280, 1000 - this.wave * 80);
  }

  loseLife() {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.lives = 0;
      this.running = false;
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.updateHud();
      this.setStatus(`Signal lost. Final score ${this.score}.`);
      this.render();
      return;
    }

    this.spawnWave();
    this.bullets = [];
    this.enemyShots = [];
    this.createBarriers();
    this.player.x = this.canvas.width / 2;
    this.updateHud();
    this.setStatus(`The noise broke through. ${this.lives} lives left.`);
  }

  updateHud() {
    if (this.scoreEl) this.scoreEl.textContent = `Score: ${this.score}`;
    if (this.livesEl) this.livesEl.textContent = `Lives: ${this.lives}`;
    if (this.waveEl) this.waveEl.textContent = `Wave: ${this.wave}`;
  }

  setStatus(message) {
    if (this.statusEl) this.statusEl.textContent = message;
  }

  render() {
    if (!this.ctx) return;
    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#101531');
    gradient.addColorStop(1, '#050712');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach((star) => {
      ctx.fillStyle = 'rgba(245, 208, 99, 0.7)';
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    for (let y = 0; y < this.canvas.height; y += 6) {
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.fillRect(0, y, this.canvas.width, 1);
    }

    this.drawPlayer();
    this.drawBullets();
    this.drawEnemyShots();
    this.drawBarriers();
    this.drawInvaders();

    if (!this.running) {
      ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
      ctx.font = '12px "Space Grotesk", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CONSTELLATION DEFENDER', this.canvas.width / 2, this.canvas.height / 2 - 12);
      ctx.fillStyle = 'rgba(248,248,242,0.6)';
      ctx.fillText('Protect the signal from falling noise', this.canvas.width / 2, this.canvas.height / 2 + 14);
    }
  }

  drawPlayer() {
    const { ctx, player } = this;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = '#F5D063';
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(12, 10);
    ctx.lineTo(0, 4);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(-2, -2, 4, 12);
    ctx.restore();
  }

  drawBullets() {
    const { ctx } = this;
    ctx.fillStyle = '#F5D063';
    this.bullets.forEach((bullet) => {
      ctx.fillRect(bullet.x - 1.5, bullet.y - 8, 3, 10);
    });
  }

  drawEnemyShots() {
    const { ctx } = this;
    ctx.fillStyle = '#FF6B35';
    this.enemyShots.forEach((shot) => {
      ctx.fillRect(shot.x - 1.5, shot.y - 2, 3, 10);
    });
  }

  drawBarriers() {
    const { ctx } = this;
    this.barriers.forEach((barrier) => {
      if (barrier.health <= 0) return;
      const alpha = 0.25 + barrier.health * 0.15;
      ctx.fillStyle = `rgba(13, 148, 136, ${alpha})`;
      ctx.fillRect(barrier.x - barrier.width / 2, barrier.y - barrier.height / 2, barrier.width, barrier.height);
      ctx.strokeStyle = 'rgba(245, 208, 99, 0.3)';
      ctx.strokeRect(barrier.x - barrier.width / 2, barrier.y - barrier.height / 2, barrier.width, barrier.height);
    });
  }

  drawInvaders() {
    const { ctx } = this;
    this.invaders.forEach((invader) => {
      if (!invader.alive) return;
      ctx.save();
      ctx.translate(invader.x, invader.y);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-7, -5, 14, 10);
      ctx.fillStyle = 'rgba(30, 58, 138, 0.45)';
      ctx.fillRect(-7, -5, 14, 10);
      ctx.fillStyle = '#F5D063';
      ctx.fillRect(-4, -1, 2, 2);
      ctx.fillRect(2, -1, 2, 2);
      ctx.fillRect(-8, 6, 3, 2);
      ctx.fillRect(5, 6, 3, 2);
      ctx.restore();
    });
  }
}

// ===== EASTER EGGS =====
class EasterEggs {
  constructor() {
    this.initThirdEye();
    this.init108();
  }

  // Triple-click on nav symbol = Third Eye glow
  initThirdEye() {
    const symbol = document.getElementById('navSymbol');
    if (!symbol) return;
    let clickCount = 0;
    let clickTimer = null;

    symbol.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 500);

      if (clickCount === 3) {
        clickCount = 0;
        symbol.classList.add('third-eye-active');
        symbol.textContent = 'ॐ';
        showToast('ॐ नमः शिवाय 🙏', 'success');
        setTimeout(() => {
          symbol.classList.remove('third-eye-active');
          symbol.textContent = '✦';
        }, 3000);
      }
    });
  }

  // Hidden 108 counter in console
  init108() {
    console.log('%c🙏 ॐ नमः शिवाय 🙏', 'font-size: 20px; color: #FF6B35; font-weight: bold;');
    console.log('%cMade with devotion and love — 108', 'font-size: 12px; color: #D4AF37;');
  }
}

// ===== INIT =====
async function init() {
  new ParticleSystem('particleCanvas');
  new CustomCursor();
  new Navigation();
  new JournalSystem();
  new AwardsCarousel();
  new MagneticHover();
  new ContactForm();
  new SmoothScroll();
  new CosmosGame();
  new EasterEggs();

  if (hasConstrainedDevice()) return;

  await waitForGSAP();
  const scrollAnims = new ScrollAnimations();
  scrollAnims.init();
  const counterAnim = new CounterAnimation();
  counterAnim.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
