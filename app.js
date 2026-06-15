/* -------------------------------------------------------------
 * BIDEX CONSTRUCTION - Interaction & Animations
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Header Scroll Effect ---
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger once on load in case of refresh

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    document.body.classList.toggle('nav-open');
  });

  // Close mobile menu when clicking a link or clicking outside
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Smooth Scroll Alignment ---
  // Overrides standard scroll to account for sticky header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70; // Height of header when scrolled
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Contact Form & WhatsApp Redirection ---
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formGeneralError = document.getElementById('formGeneralError');

  // Fields and error message elements
  const fields = [
    { input: document.getElementById('formName'), error: document.getElementById('nameError') },
    { input: document.getElementById('formPhone'), error: document.getElementById('phoneError') },
    { input: document.getElementById('formMessage'), error: document.getElementById('messageError') }
  ];

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset status messages
    formSuccess.style.display = 'none';
    formGeneralError.style.display = 'none';
    let isFormValid = true;

    // Validate fields
    fields.forEach(field => {
      const group = field.input.parentElement;
      const value = field.input.value.trim();
      
      if (!value) {
        group.classList.add('has-error');
        isFormValid = false;
      } else if (field.input.type === 'tel') {
        // Simple phone validation (digits, plus sign, spaces, dashes)
        const phoneRegex = /^[+]?[0-9\s\-]{7,15}$/;
        if (!phoneRegex.test(value)) {
          group.classList.add('has-error');
          field.error.textContent = 'Please enter a valid phone number';
          isFormValid = false;
        } else {
          group.classList.remove('has-error');
        }
      } else {
        group.classList.remove('has-error');
      }
    });

    if (!isFormValid) {
      formGeneralError.textContent = 'Please correct the errors in the form before submitting.';
      formGeneralError.style.display = 'block';
      return;
    }

    // Capture values
    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    // Show success message
    formSuccess.style.display = 'block';
    
    // Disable form fields & submit button during redirect
    const inputs = contactForm.querySelectorAll('.form-input, .btn');
    inputs.forEach(input => input.setAttribute('disabled', 'true'));

    // Construct WhatsApp pre-filled text message
    const companyPhone = '2349125461925';
    const textMsg = `Hello Bidex Construction,\n\nI would like to get a quote/discuss a project.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Project Details:* ${message}`;
    const encodedMsg = encodeURIComponent(textMsg);
    const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodedMsg}`;

    // Redirect after brief delay so user sees success feedback
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Reset form state
      contactForm.reset();
      inputs.forEach(input => input.removeAttribute('disabled'));
      formSuccess.style.display = 'none';
    }, 1500);
  });

  // Clear errors dynamically on input
  fields.forEach(field => {
    field.input.addEventListener('input', () => {
      const group = field.input.parentElement;
      if (field.input.value.trim()) {
        group.classList.remove('has-error');
      }
    });
  });

  // --- GSAP & ScrollTrigger Animations ---
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Entrance Animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTl.fromTo('.hero-image', { scale: 1 }, {
      scale: 1.05,
      duration: 2,
      ease: 'power2.out'
    }, 0);

    heroTl.fromTo('.hero-tagline', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, 0.2);

    heroTl.fromTo('.hero-title', { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 1
    }, 0.4);

    heroTl.fromTo('.hero-subtext', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, 0.6);

    heroTl.fromTo('.hero-actions', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, 0.8);

    heroTl.fromTo('.hero-footer', { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 1
    }, 1.0);

    // 2. Scroll-Triggered Animations for all sections
    const animateOnScrollElements = gsap.utils.toArray('.animate-on-scroll');
    
    animateOnScrollElements.forEach(element => {
      gsap.fromTo(element, 
        { 
          opacity: 0, 
          y: 40 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Subtle fade in for service cards sequentially (stagger effect)
    gsap.fromTo('.service-card', 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services .grid-3',
          start: 'top 80%'
        }
      }
    );

    // Subtle fade in for testimonial cards sequentially (stagger effect)
    gsap.fromTo('.testimonial-card', 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 80%'
        }
      }
    );

    // Subtle fade in for gallery items (stagger effect)
    gsap.fromTo('.gallery-item', 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 80%'
        }
      }
    );
  }
});
