import React, { useState } from 'react';
import './Subscribe.css';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const val = email.trim();
    if (!isValidEmail(val)) {
      setError('Please enter a valid email address');
      return;
    }
    if (loading) return;
    setLoading(true);

    const params = new URLSearchParams({
      source: 'website_subscribe',
      utm_source: 'ink_home_site',
    });
    params.set('email', val);
    const url = `https://medium.com/the-ink-home/newsletter?${params.toString()}`;

    // fire-and-forget analytics ping before redirect (sendBeacon preferred)
    try {
      const trackUrl = '/api/track?event=subscribe';
      const payload = JSON.stringify({ email: val });
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator && typeof navigator.sendBeacon === 'function') {
        try { navigator.sendBeacon(trackUrl, blob); } catch (e) { /* noop */ }
      } else {
        // fallback to fetch keepalive
        try { fetch(trackUrl, { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(()=>{}); } catch (e) {}
      }
    } catch (e) {
      // don't block redirect on tracking errors
    }

    // small visual delay for UX
    setTimeout(() => {
      window.location.href = url;
    }, 220);
  }

  return (
    <div className="subscribe-card" role="region" aria-label="Subscribe to The Ink Home">
      <div className="subscribe-inner">
        <h3 className="subscribe-title">Subscribe to The Ink Home</h3>
        <p className="subscribe-sub">Get new stories delivered straight to your inbox</p>

        <form className="subscribe-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="subscribe-email" className="visually-hidden">Email address</label>
            <input
              id="subscribe-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              aria-invalid={!!error}
              required
            />
            {error && <div id="subscribe-error" className="error" role="alert">{error}</div>}
          </div>

          <div className="actions">
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Redirecting...' : 'Subscribe'}</button>
            <a className="read-medium" href="https://medium.com/the-ink-home" target="_blank" rel="noopener noreferrer">Read on Medium</a>
          </div>
        </form>
      </div>
    </div>
  );
}
