# Gear Guru Guide Blog Publishing Guide

## Purpose
The blog lives at `gearguruguide.com/blog/` and supports the existing buying guides with evergreen search-focused articles. Keep the same editorial voice: practical, skeptical of hype, and clear about uncertainty.

## Add a new article
1. Open `src/BlogPages.tsx`.
2. Copy one object inside `blogPosts`.
3. Give it a unique lowercase hyphenated `slug`.
4. Write a descriptive title and a meta-ready `dek` of roughly 120–160 characters.
5. Choose one primary topic/category.
6. Add 3–6 useful sections that answer the searcher's question directly.
7. Link to a relevant buying guide with `relatedGuide` when appropriate.
8. Add the article URL to `public/sitemap.xml`.
9. Rebuild the site and upload the new `dist` files.

## SEO rules
- One clear search intent per article.
- Do not stuff keywords. Use natural headings that answer real questions.
- Prefer evergreen advice over thin news rewrites.
- Verify time-sensitive specs, pricing, regulations, and manufacturer claims before publishing.
- Add original photos, testing notes, tables, or field observations when available.
- Link between related blog posts, buying guides, and relevant product research.
- Do not publish placeholder or AI-filler articles just to increase page count.

## Product images
Use the established 1200 × 1200 px square image standard. Export WebP/JPG where practical and aim for <=250 KB per image.
