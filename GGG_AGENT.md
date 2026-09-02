# GGG Production Deployment Agent

## Mission
Get https://gearguruguide.com actually deployed, working, and verified live on Cloudflare.

## Hard locks
- Work only on Gear Guru Guide.
- Repository: `NeoHeathen/Gear-Guru-Guide`
- Branch: `cloudflare-production-prep`
- Preserve the Manus-derived React/Vite frontend, existing public functionality, and protected owner dashboard.
- Do not claim deployment or production success until the real domain is checked successfully.
- Do not perform unrelated redesigns or hosting changes.

## Verified repository state
- Application is React/Vite with an Express 5 backend.
- Production build currently targets a Node server (`dist-server/index.js`).
- Database access uses `mysql2/promise` and `process.env.DATABASE_URL`.
- No Wrangler configuration is currently present on this branch.

## Current Cloudflare target architecture
Use current Cloudflare Workers + Vite/static assets for the SPA and a Worker API entry for `/api/*`.

Cloudflare requirements verified against current docs:
- Use a compatibility date of `2026-08-04` or later so current Node.js compatibility is enabled by default.
- SPA assets must use `assets.not_found_handling = "single-page-application"`.
- API routes should run Worker-first (for example `/api/*`).
- MySQL can use `mysql2` through Hyperdrive. `mysql2 >= 3.13.0` is required; this repo currently uses `^3.23.4`.
- Hyperdrive must be created from the actual production MySQL connection and its binding ID must be added to Cloudflare configuration.
- MySQL Worker connections should use Hyperdrive credentials and `disableEval: true` where required by `mysql2` on Workers.

## Verified blocker
The repository has not yet been converted from a Node HTTP-listening Express process to a Worker `fetch` entry. `server/index.ts` currently calls `node:http.createServer()` and `server.listen()`, which cannot be treated as a completed Workers deployment.

Authenticated Cloudflare actions are also still required to create/reuse the Worker project, create/reuse Hyperdrive, configure secrets/bindings, deploy, attach the custom domain, and verify production.

## Execution order
1. Inspect latest branch state before editing.
2. Convert backend entry to a Worker-compatible request handler without destroying API behavior.
3. Adapt database access for Hyperdrive while preserving tests and validation.
4. Add current Cloudflare Vite/Wrangler configuration.
5. Update package scripts/dependencies only as necessary.
6. Run TypeScript check, tests, production build, and Cloudflare preview in an execution environment.
7. Fix only errors proven by output.
8. Deploy with authenticated Cloudflare access.
9. Verify temporary Cloudflare URL.
10. Connect `gearguruguide.com` while respecting Hostinger-managed domain/DNS state.
11. Verify HTTPS, homepage, assets, important routes, APIs, and owner-dashboard protection on the real domain.

## Success condition
Only report `✅ GGG IS LIVE` after `https://gearguruguide.com` itself is opened and verified working in production.
