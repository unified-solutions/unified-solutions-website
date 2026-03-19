/* ========================================
   UNIFIED SOLUTIONS — App Logic
   GSAP animations, light theme default,
   FormSubmit.co integration, bilingual
   ======================================== */

(function () {
  'use strict';

  // ── State ──
  let currentLang = 'en';
  let currentTheme = 'light'; // Light theme as default (user requirement #8)

  const root = document.documentElement;

  // ── Theme: Always start light ──
  root.setAttribute('data-theme', 'light');
  const themeBtn = document.querySelector('[data-theme-toggle]');
  updateThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeBtn) return;
    const labelEn = currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    const labelFr = currentTheme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre';
    themeBtn.setAttribute('aria-label', currentLang === 'en' ? labelEn : labelFr);
    themeBtn.innerHTML = currentTheme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // ── Language Toggle ──
  const langBtn = document.getElementById('langToggle');

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'fr' : 'en';
      applyLanguage();
    });
  }

  function applyLanguage() {
    root.setAttribute('lang', currentLang);

    if (langBtn) {
      langBtn.textContent = currentLang === 'en' ? 'FR' : 'EN';
      langBtn.setAttribute('aria-label', currentLang === 'en' ? 'Passer au français' : 'Switch to English');
    }

    // Update all elements with data-en / data-fr attributes
    document.querySelectorAll('[data-en][data-fr]').forEach(function(el) {
      var text = el.getAttribute('data-' + currentLang);
      if (text) {
        if (text.indexOf('<') !== -1) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update <title>
    var titleEl = document.querySelector('title[data-en][data-fr]');
    if (titleEl) {
      document.title = titleEl.getAttribute('data-' + currentLang);
    }

    // Update meta description
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      var desc = metaDesc.getAttribute('data-' + currentLang);
      if (desc) metaDesc.setAttribute('content', desc);
    }

    // Update placeholders
    document.querySelectorAll('[data-placeholder-en][data-placeholder-fr]').forEach(function(el) {
      el.placeholder = el.getAttribute('data-placeholder-' + currentLang);
    });

    // Update select option text
    document.querySelectorAll('select option[data-en][data-fr]').forEach(function(opt) {
      opt.textContent = opt.getAttribute('data-' + currentLang);
    });

    // Update hidden form fields for FormSubmit
    var subjectField = document.getElementById('formSubject');
    if (subjectField) {
      subjectField.value = currentLang === 'en'
        ? 'New Rate Analysis Request'
        : 'Nouvelle demande d\'analyse de taux';
    }

    updateThemeIcon();
  }

  // ── Sticky Header Shadow ──
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          header.classList.toggle('scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Mobile Menu ──
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavClose = document.getElementById('mobileNavClose');

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMobileMenu() {
    mobileNav.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      if (mobileNav.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeMobileMenu);
    }

    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ── File Upload ──
  var fileUploadArea = document.getElementById('fileUploadArea');
  var fileInput = document.getElementById('statementFile');
  var filePreview = document.getElementById('filePreview');
  var fileNameEl = document.getElementById('fileName');
  var fileRemove = document.getElementById('fileRemove');

  if (fileUploadArea && fileInput) {
    fileUploadArea.addEventListener('click', function() { fileInput.click(); });

    fileUploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      fileUploadArea.classList.add('dragging');
    });
    fileUploadArea.addEventListener('dragleave', function() {
      fileUploadArea.classList.remove('dragging');
    });
    fileUploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      fileUploadArea.classList.remove('dragging');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        showFilePreview(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', function() {
      if (fileInput.files.length) {
        showFilePreview(fileInput.files[0]);
      }
    });

    if (fileRemove) {
      fileRemove.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.value = '';
        filePreview.style.display = 'none';
        fileUploadArea.style.display = '';
      });
    }
  }

  function showFilePreview(file) {
    if (!filePreview || !fileNameEl) return;
    var size = (file.size / (1024 * 1024)).toFixed(1);
    fileNameEl.textContent = file.name + ' (' + size + ' MB)';
    filePreview.style.display = 'flex';
    fileUploadArea.style.display = 'none';
  }

  // ── Form Submission via FormSubmit.co ──
  var form = document.getElementById('leadForm');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    // Set _next to current page URL so user returns after FormSubmit redirect
    var nextField = document.getElementById('formNext');
    if (nextField) {
      nextField.value = window.location.href;
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var firstName = form.querySelector('#firstName');
      var email = form.querySelector('#email');

      if (!firstName.value.trim() || !email.value.trim()) {
        if (!firstName.value.trim()) firstName.style.borderColor = 'var(--color-error)';
        if (!email.value.trim()) email.style.borderColor = 'var(--color-error)';
        return;
      }

      // Submit via fetch to FormSubmit.co
      var formData = new FormData(form);
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnHTML = submitBtn.innerHTML;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = currentLang === 'en'
        ? '<span style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Sending...</span>'
        : '<span style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Envoi...</span>';

      fetch(form.action, {
        method: 'POST',
        body: formData
      }).then(function(response) {
        // FormSubmit returns 200 on success
        if (response.ok || response.status === 200) {
          form.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(function() {
        // Fallback: open mailto
        var data = new FormData(form);
        var subject = encodeURIComponent(
          currentLang === 'en'
            ? 'New Rate Analysis Request'
            : 'Nouvelle demande d\'analyse de taux'
        );
        var body = encodeURIComponent(
          (currentLang === 'en' ? 'Name: ' : 'Nom: ') + data.get('First Name') + ' ' + data.get('Last Name') + '\n' +
          'Email: ' + data.get('Email') + '\n' +
          (currentLang === 'en' ? 'Phone: ' : 'Tél: ') + (data.get('Phone') || 'N/A') + '\n' +
          (currentLang === 'en' ? 'Business: ' : 'Entreprise: ') + (data.get('Business Name') || 'N/A') + '\n' +
          (currentLang === 'en' ? 'Industry: ' : 'Industrie: ') + (data.get('Business Type') || 'N/A') + '\n\n' +
          (currentLang === 'en' ? 'Message: ' : 'Message: ') + (data.get('Message') || 'N/A')
        );
        window.open('mailto:info@unified-solutions.ca?subject=' + subject + '&body=' + body, '_blank');

        // Still show success
        form.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }).finally(function() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      });
    });

    // Clear error styling on input focus
    form.querySelectorAll('input, textarea, select').forEach(function(el) {
      el.addEventListener('focus', function() {
        el.style.borderColor = '';
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetSel = this.getAttribute('href');
      if (targetSel === '#') return;
      var target = document.querySelector(targetSel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========================================
  // GSAP ANIMATIONS
  // ========================================

  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Hero entrance ──
    var heroContent = document.querySelector('[data-animate="hero"]');
    if (heroContent) {
      gsap.to(heroContent, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    var heroCard = document.querySelector('[data-animate="hero-card"]');
    if (heroCard) {
      gsap.to(heroCard, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.5
      });
    }

    // ── Counter animations ──
    document.querySelectorAll('[data-count]').forEach(function(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var prefix = el.getAttribute('data-count-prefix') || '';
      if (isNaN(target)) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = prefix + Math.round(this.targets()[0].val) + '+';
            }
          });
        }
      });
    });

    // ── Fade-up elements ──
    document.querySelectorAll('[data-animate="fade-up"]').forEach(function(el) {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // ── Staggered grid children ──
    document.querySelectorAll('[data-animate="stagger"]').forEach(function(container) {
      var children = container.children;
      if (!children.length) return;

      gsap.to(children, {
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    });

    // ── Counter stat in hero ──
    var counterStat = document.querySelector('[data-animate="counter"]');
    if (counterStat) {
      gsap.to(counterStat, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8
      });
    }

    // ── Parallax on hero shapes ──
    document.querySelectorAll('.shape').forEach(function(shape, i) {
      gsap.to(shape, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: (i + 1) * 60,
        ease: 'none'
      });
    });

    // ── Magnetic hover on buttons (desktop only) ──
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.btn-primary, .btn-accent').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
          var rect = btn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        btn.addEventListener('mouseleave', function() {
          gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    // ── Smooth section reveal for guarantee ──
    var guarantee = document.querySelector('.guarantee-inner');
    if (guarantee) {
      // guarantee-inner doesn't have data-animate, animate separately
      gsap.from(guarantee, {
        scrollTrigger: {
          trigger: '.guarantee-section',
          start: 'top 80%',
          once: true
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }

  // Wait for GSAP to load (deferred script)
  if (document.readyState === 'complete') {
    initGSAP();
  } else {
    window.addEventListener('load', initGSAP);
  }

  // Add spin keyframe for loading button
  var styleSheet = document.createElement('style');
  styleSheet.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(styleSheet);

})();
