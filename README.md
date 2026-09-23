# rayrosound.com

Personal site for Ray Ro (DJ · producer · music curator, Dubai). Static, no build step.

- `index.html` — all content lives here (edit text directly)
- `css/styles.css` — tokens at the top (palette, type scale, easing)
- `js/haze.js` — canvas hero fallback until `assets/video/hero.mp4` exists
- `js/main.js` — Lenis smooth scroll, GSAP text-mask reveals, parallax, cursor, YouTube lightbox
- `assets/` — photos, EPK PDF, video slots (see `HIGGSFIELD.md`)

Fonts: Clash Display + General Sans (Fontshare), JetBrains Mono (Google Fonts).

## Preview

```bash
python3 -m http.server 8765
open http://127.0.0.1:8765/
```

Append `?shot` to freeze motion for screenshots.

## Deploy

GitHub Pages from `main`, custom domain `rayrosound.com` (see `CNAME`). Push to `main` = live in about a minute.

DNS at Porkbun:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  rayrosound-sudo.github.io
```

Delete Porkbun's default `ALIAS @` and `CNAME *` records first.

## SEO

- Title/description/keywords in `index.html` head; structured data (`@graph`: WebSite, Person+MusicGroup, Service) in the same file.
- `sitemap.xml` (bump `<lastmod>` on content changes), `robots.txt`.
- IndexNow key = `.indexnow-key` + `<key>.txt` at root; re-ping after big updates:
  `curl -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json' -d '{"host":"rayrosound.com","key":"<key>","urlList":["https://rayrosound.com/"]}'`
- Google Search Console: add property `rayrosound.com` (DNS TXT verification via Porkbun API), submit sitemap. Needs Ray's Google login.

## Editing checklist

- WhatsApp number: `data-whatsapp` link in the contact section (currently a placeholder)
- Replace `assets/RayRo-EPK.pdf` when the EPK is updated
- Hero / F1 video: drop files into `assets/video/`, nothing else to change
