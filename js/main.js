// Kushi Cabs - Main JavaScript File
// Handles navigation, interactivity, and accessibility

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      
      // Update hamburger appearance
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when link is clicked
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        navLinks.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#contact' && href !== '#faq') {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Mobile responsive menu close on outside click
  document.addEventListener('click', function(event) {
    if (navLinks && hamburger) {
      const isClickInsideNav = navLinks.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    }
  });

  // Accessibility: Handle FAQ details toggle with keyboard
  const details = document.querySelectorAll('details.faq-item');
  details.forEach(detail => {
    const summary = detail.querySelector('summary');
    if (summary) {
      summary.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          detail.open = !detail.open;
        }
      });
    }
  });

  // Form validation (if needed on delete account page)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Add form validation if needed
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.setAttribute('aria-invalid', 'true');
        } else {
          field.setAttribute('aria-invalid', 'false');
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields');
      }
    });
  });

  // Analytics tracking (basic)
  trackPageView();
});

// Track page views for analytics
function trackPageView() {
  const page = window.location.pathname;
  if (window.gtag) {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: page,
      page_title: document.title
    });
  }
}

// Print styles
window.addEventListener('beforeprint', function() {
  // Add print-specific styles if needed
  document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
  document.body.classList.remove('printing');
});

// Accessibility: Announce dynamic content changes
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Visually hidden but available to screen readers
  announcement.textContent = message;
  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

// Cookie consent banner (if needed)
function showCookieConsent() {
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #333;
      color: white;
      padding: 1rem;
      text-align: center;
      z-index: 999;
    `;
    banner.innerHTML = `
      <p>We use cookies to improve your experience. By using our app, you consent to our cookie usage.</p>
      <button onclick="acceptCookies()" class="btn btn-primary" style="margin-left: 1rem;">Accept</button>
    `;
    document.body.appendChild(banner);
  }
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'true');
  const banner = document.querySelector('.cookie-banner');
  if (banner) {
    banner.remove();
  }
}

// Lazy loading for images (if needed)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Export for use in other scripts
window.KushiCabs = {
  announceToScreenReader,
  acceptCookies,
  showCookieConsent
};
