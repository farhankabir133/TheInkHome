(() => {
  const form = document.getElementById('the-ink-home-form');
  if (!form) return;
  const emailInput = document.getElementById('the-ink-home-email');
  const errorBox = document.getElementById('the-ink-home-error');
  const button = document.getElementById('the-ink-home-cta');
  const MEDIUM_URL = 'https://medium.com/the-ink-home/newsletter';

  function isValidEmail(v) {
    if (!v) return false;
    // Basic RFC-ish check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    emailInput.setAttribute('aria-invalid', 'true');
  }

  function clearError() {
    errorBox.textContent = '';
    errorBox.hidden = true;
    emailInput.removeAttribute('aria-invalid');
  }

  function setLoading(on) {
    if (on) {
      button.disabled = true;
      button.textContent = 'Redirecting...';
    } else {
      button.disabled = false;
      button.textContent = 'Subscribe';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    const email = (emailInput.value || '').trim();
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address');
      emailInput.focus();
      return;
    }
    // Prevent double-submits
    if (button.disabled) return;
    setLoading(true);

    // Build redirect URL with optional params
    const params = new URLSearchParams();
    params.set('source', 'website_subscribe');
    // Add utm_source for analytics
    params.set('utm_source', 'ink_home_site');
    try {
      // Only include email param as a convenience; Medium may ignore it.
      params.set('email', email);
    } catch (e) {}

    const url = `${MEDIUM_URL}?${params.toString()}`;

    // Small success animation before redirect
    form.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0.6, transform: 'translateY(-4px)' }
    ], { duration: 240, easing: 'ease-out' });

    // Delay briefly to show animation
    // fire-and-forget analytics ping before redirect
    try {
      const trackUrl = '/api/track?event=subscribe';
      const payload = JSON.stringify({ email });
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator && typeof navigator.sendBeacon === 'function') {
        try { navigator.sendBeacon(trackUrl, blob); } catch (e) { /* noop */ }
      } else {
        try { fetch(trackUrl, { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(()=>{}); } catch (e) {}
      }
    } catch (e) {}

    setTimeout(() => {
      window.location.href = url;
    }, 260);
  });

  emailInput.addEventListener('input', () => { clearError(); });
})();
