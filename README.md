# Gear Guru Guide

Independent outdoor gear research for people who refuse to age quietly.

This repository contains the Gear Guru Guide website, its 500-product research catalog, editorial guides, brand directory, and GitHub Pages deployment workflow.

## Local development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm exec tsc -b
ADMIN_DASHBOARD_PASSWORD='local-test-only-password' pnpm exec vitest run
pnpm exec vite build
```

The production site is configured for `gearguruguide.com` while Hostinger remains responsible for domain registration, DNS, and email.
