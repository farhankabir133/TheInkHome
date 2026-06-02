Subscribe Widget — The Ink Home
================================

Files
- `subscribe-widget.html` — standalone embed markup (includes script and stylesheet links).
- `subscribe-widget.css` — styling for the widget (responsive, accessible, dark mode).
- `subscribe-widget.js` — client-side validation and redirect logic.

How it works
- The widget collects a single email address, validates it on the client, and redirects the user to Medium's official newsletter signup with tracking params. It does not store emails locally and does not bypass Medium's newsletter flow.

Embedding
- Copy the three files into your site (e.g. `/public` folder) and include the HTML fragment where you want the card to appear. Or use the standalone page `subscribe-widget.html`.

Example (include the inner HTML where you want the card):
```html
<!-- place inside your page where you want the card -->
<div id="subscribe-placeholder"></div>
<!-- then load the widget html or server-include it -->
```

Notes
- We add `utm_source=ink_home_site` and `source=website_subscribe` to help track signups in Medium's analytics.
- The widget includes basic accessibility (labels, aria-live error announcements) and prevents double submission.
- Email is passed as a URL parameter `email=`; Medium's public form may ignore it, but passing helps some landing pages prefill their forms.

Privacy
- Do not store the email in your app. This widget intentionally redirects the user to Medium to complete the subscription on Medium's servers.

Optional enhancements
- Use a server-side proxy to prefill forms more reliably (not recommended without explicit Medium integration).
- Add an event to record that a redirect occurred to your analytics endpoint before redirection.
