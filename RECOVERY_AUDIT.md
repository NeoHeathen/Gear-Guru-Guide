# Gear Guru Guide recovery baseline

Recovered on 2026-09-01 from the complete Manus export and its later blog-enabled source package.

## Verified baseline

- React + TypeScript + Vite application source is present.
- The catalog contains 500 unique maker/model records across 85 brands.
- Three cornerstone buying guides, five blog articles, the brand directory, partnership page, and five policy pages are present.
- `robots.txt`, `sitemap.xml`, canonical metadata, route metadata, structured data, the custom-domain `CNAME`, SPA fallback, and the GitHub Pages workflow are present.
- Affiliate destinations are not invented or hardcoded. Public affiliate offers appear only from active owner records; Amazon records require HTTPS, an Amazon destination, and a tracking tag.
- TypeScript compilation, all 21 recovered automated tests, and a production Vite build pass.

## Audit findings

### Pass

- Catalog integrity: 500 products, 500 unique maker/model pairs, 85 brands.
- Disclosure controls: affiliate placements render a nearby disclosure and `rel="sponsored noopener noreferrer"`.
- Indexing controls: public routes are indexable; `/owner-dashboard` and `/api/` are disallowed in `robots.txt`; the owner route receives `noindex,nofollow` at runtime.
- Crawl assets: sitemap covers all public routes represented by the recovered application.
- Canonicals and page metadata: route-specific titles, descriptions, canonicals, Open Graph metadata, and JSON-LD are generated.
- Source integrity: product research uses official-source URLs and does not substitute unverified affiliate URLs.

### Open production blockers

1. GitHub Pages serves the public static site, but the MySQL-backed owner dashboard and `/api/*` endpoints require a separate Node/Hostinger deployment. They are not functional on static GitHub Pages alone.
2. No affiliate links are active yet. This is intentional until exact approved destinations and tracking credentials are supplied; do not manufacture replacements.
3. Product imagery is intentionally represented by decorative category artwork. Product-specific images and their alt text remain future work after licensed or program-approved assets are available.
4. The recovered source has 21 automated tests. Manus reported a later 61-test accessibility checkpoint, but that later owner-only project snapshot was not included in the downloadable source archives. The current source still includes the darker, high-legibility blog-enabled baseline available in the workspace; future owner exports should be compared before overwriting it.

## Deployment baseline

The restored `main` branch is the source of truth. Pushes to `main` run the GitHub Pages workflow, build `dist`, create the SPA fallback, and deploy the public site for `gearguruguide.com`.
