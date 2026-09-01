# Gear Guru Guide — Finish Before Public Launch

These are the remaining owner inputs or service connections. They are intentionally kept out of the visible site copy.

## Required before launch

- [ ] Create and test `hello@gearguruguide.com` in Hostinger Mail (general/editorial contact and temporary field-brief signup requests).
- [ ] Create and test `partners@gearguruguide.com` in Hostinger Mail (business, sponsorship, product-review and ambassador inquiries).
- [ ] Decide whether the first launch is **static public site only** or the **full Node + MySQL app**. The public editorial site works without the owner affiliate dashboard; the dashboard requires Node and MySQL.
- [ ] If using the full app, configure `DATABASE_URL` and `ADMIN_DASHBOARD_PASSWORD`, run the included MySQL migration, and verify `/owner-dashboard` is not indexed.
- [ ] If using static/shared hosting, upload the contents of `dist/` into `public_html/` and include `.htaccess` so clean routes such as `/guides` and `/brands` do not 404 on refresh.
- [ ] Rebuild the production bundle from the updated source before upload. The ZIP did not include `node_modules`, and this audit environment could not reach npm to reinstall dependencies, so I could not produce a fresh compiled bundle here.
- [ ] Confirm both `https://gearguruguide.com` and `https://www.gearguruguide.com` resolve over HTTPS; redirect one to the canonical version.
- [ ] Preserve Hostinger Mail DNS records (MX/SPF/DKIM/DMARC) when changing website DNS.

## Email / newsletter

- [ ] The current field-brief form now prepares a signup email instead of falsely claiming a subscription was stored.
- [ ] When ready, replace the temporary email-based signup with your chosen mailing-list provider and then update the Privacy page with that provider’s data handling.

## Content to finish

- [ ] Publish real YouTube review URLs as videos go live; the site currently has deliberate “video in production” modules in the guides.
- [ ] Decide which research-queue products should become full articles or reviews first.
- [ ] Add first-hand field-test language only after actual testing; current copy correctly avoids claiming field use where it has not happened.
- [ ] Verify product model names and manufacturer URLs immediately before publishing because specs and product lines change.

## Monetization — only when approved

- [ ] Apply to affiliate programs only after the public site and contact mailboxes are live.
- [ ] Add approved affiliate links through the private dashboard only after its database/backend is configured.
- [ ] Keep the near-link affiliate disclosure enabled for every active offer.
- [ ] Recheck current Amazon/merchant program rules before enabling links or importing merchant images/prices.

## Search / measurement

- [ ] Add the site to Google Search Console and submit `/sitemap.xml` after DNS is live.
- [ ] Add analytics only if you want it; if it collects personal data/cookies, update Privacy and consent behavior before enabling it.
- [ ] Replace the sitemap `lastmod` dates when the final production build is published.

## Product-image workflow

- [ ] Use a 1:1 square source image for every product.
- [ ] Recommended master: **1200 × 1200 px**.
- [ ] Keep the product centered with roughly 8–10% breathing room on each edge.
- [ ] Export web display files as WebP when practical; target roughly **250 KB or less** per product image.
- [ ] Avoid text baked into product photography unless it is part of the product itself.
- [ ] A matching Gear Guru Guide placeholder master is included in `public/product-images/`.
