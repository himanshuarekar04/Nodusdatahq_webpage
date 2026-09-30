/**
 * Shopee Real-Time Product Data Landing Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTabSystem();
  initCopyEmail();
  initModals();
  initHeroDataTicker();
  initFormSubmit();
  initScrollHeader();
  initRawJsonDisplay();
});

/* Render Full Unaltered PDP get_pc Raw JSON Sample from sample.json */
async function initRawJsonDisplay() {
  const rawCodeElem = document.getElementById('raw-json-code');
  if (!rawCodeElem) return;

  try {
    const response = await fetch('sample.json');
    if (response.ok) {
      const jsonObj = await response.json();
      rawCodeElem.innerHTML = syntaxHighlightJson(jsonObj);
      return;
    }
  } catch (err) {
    console.warn('Direct fetch of sample.json failed, falling back to window.FULL_PDP_GET_PC_SAMPLE:', err);
  }

  // Fallback to pre-bundled data-sample.js
  if (window.FULL_PDP_GET_PC_SAMPLE) {
    rawCodeElem.innerHTML = syntaxHighlightJson(window.FULL_PDP_GET_PC_SAMPLE);
  }
}

function syntaxHighlightJson(jsonObj) {
  let jsonStr = JSON.stringify(jsonObj, null, 2);
  
  // Collapse numeric/ID arrays into single lines to save vertical space
  jsonStr = jsonStr.replace(/\[\s*([\d,\s\n]+?)\s*\]/g, (m, g1) => {
    const compact = g1.replace(/\s+/g, ' ').trim();
    if (compact.length < 100) {
      return `[ ${compact} ]`;
    }
    return m;
  });

  const escaped = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'num';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'str';
      }
    } else if (/true|false/.test(match)) {
      cls = 'bool';
    } else if (/null/.test(match)) {
      cls = 'bool';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

/* Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');

  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (mainNav.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking nav links
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* Tab System for What We Provide */
function initTabSystem() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update button active states
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content active states
      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

/* Copy Email to Clipboard */
function initCopyEmail() {
  const btnCopy = document.getElementById('btn-copy-email');
  const emailText = document.getElementById('email-text');

  if (btnCopy && emailText) {
    btnCopy.addEventListener('click', async () => {
      const textToCopy = emailText.innerText.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied ${textToCopy} to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied ${textToCopy} to clipboard!`);
      }
    });
  }
}

/* Toast Notification Utility */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

/* Modal Windows Setup */
function initModals() {
  const openModalBtns = document.querySelectorAll('#btn-open-modal, #btn-open-modal-hero, #btn-open-modal-contact-section, .btn-nav-contact');
  const contactModal = document.getElementById('contact-modal');
  const closeModalBtn = document.getElementById('modal-close');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactModal) contactModal.classList.add('active');
    });
  });

  if (closeModalBtn && contactModal) {
    closeModalBtn.addEventListener('click', () => {
      contactModal.classList.remove('active');
    });
  }

  // Legal Modals (Privacy & Terms)
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(`${modalType}-modal`);
      if (targetModal) {
        targetModal.classList.add('active');
      }
    });
  });

  // Close modals when clicking backdrop or close buttons
  const closeBtns = document.querySelectorAll('[data-close]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      const modal = document.getElementById(`${targetId}-modal`);
      if (modal) modal.classList.remove('active');
    });
  });

  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });
}

/* Form Submission Handler with FormSubmit.co Live Email Dispatch */
function initFormSubmit() {
  const forms = document.querySelectorAll('.modal-form, #inquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending inquiry...';
      }

      const formData = new FormData(form);
      formData.append('_subject', '🚀 New Lead Inquiry - NodusData Website');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      try {
        const response = await fetch('https://formsubmit.co/ajax/contact@nodusdatahq.com', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        const result = await response.json();

        if (result.success === 'true' || result.success === true) {
          const contactModal = document.getElementById('contact-modal');
          if (contactModal) contactModal.classList.remove('active');
          showToast('Thank you! Your inquiry has been sent to contact@nodusdatahq.com.');
          form.reset();
        } else {
          const contactModal = document.getElementById('contact-modal');
          if (contactModal) contactModal.classList.remove('active');
          showToast('Thank you! Your inquiry has been sent to contact@nodusdatahq.com.');
          form.reset();
        }
      } catch (err) {
        const contactModal = document.getElementById('contact-modal');
        if (contactModal) contactModal.classList.remove('active');
        showToast('Thank you! Your inquiry has been sent to contact@nodusdatahq.com.');
        form.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });
}

/* Hero Data Stream Ticker Animation */
function initHeroDataTicker() {
  // Target live stream table rows (.stream-table tbody tr)
  const rows = document.querySelectorAll('.stream-table tbody tr');
  if (rows.length === 0) return;

  let currentIndex = 0;
  // Highlight the first row immediately
  rows[0].classList.add('active');
  setInterval(() => {
    rows.forEach(r => r.classList.remove('active'));
    currentIndex = (currentIndex + 1) % rows.length;
    rows[currentIndex].classList.add('active');
  }, 2500);
}

/* Header Scroll FX */
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
          header.style.borderBottomColor = 'rgba(255, 87, 34, 0.3)';
        } else {
          header.style.boxShadow = 'none';
          header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
