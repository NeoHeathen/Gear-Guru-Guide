import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { createAdminAccessHandler, verifyAdminDashboardPassword } from "./adminAuth";
import { deleteAffiliateLink, listAffiliateLinks, listPublicAffiliateOffers, listPublicVideoReviews, upsertAffiliateLink } from "./affiliateStore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
app.use(express.json({ limit: "100kb" }));
app.use("/owner-dashboard", (_req, res, next) => { res.setHeader("X-Robots-Tag", "noindex, nofollow"); next(); });

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const password = req.header("x-gearguru-admin-password") ?? "";
  if (!verifyAdminDashboardPassword(password)) return res.status(401).json({ error: "Unauthorized" });
  next();
}

app.post("/api/admin/session", (req, res) => {
  const response = createAdminAccessHandler({ password: typeof req.body?.password === "string" ? req.body.password : undefined });
  res.status(response.status).json(response.body);
});

app.get("/api/catalog/youtube", async (_req, res, next) => {
  try { res.json(await listPublicVideoReviews()); } catch (error) { next(error); }
});

app.get("/api/catalog/affiliate-offers", async (_req, res, next) => {
  try { res.json(await listPublicAffiliateOffers()); } catch (error) { next(error); }
});

app.get("/api/admin/affiliate-links", requireAdmin, async (_req, res, next) => {
  try { res.json(await listAffiliateLinks()); } catch (error) { next(error); }
});

app.put("/api/admin/affiliate-links", requireAdmin, async (req, res, next) => {
  try { await upsertAffiliateLink(req.body); res.status(204).end(); } catch (error) { next(error); }
});

app.delete("/api/admin/affiliate-links/:productId", requireAdmin, async (req, res, next) => {
  try { await deleteAffiliateLink(Number(req.params.productId)); res.status(204).end(); } catch (error) { next(error); }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "Request failed.";
  res.status(message.includes("required") || message.includes("HTTPS") || message.includes("YouTube") ? 400 : 500).json({ error: message });
});

async function start() {
  if (process.env.NODE_ENV === "production") {
    const dist = path.resolve(__dirname, "../dist");
    app.use(express.static(dist));
    app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }
  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

start().catch((error) => { console.error(error); process.exit(1); });
