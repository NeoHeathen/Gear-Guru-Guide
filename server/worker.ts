import { createServer } from "node:http";
import { httpServerHandler } from "cloudflare:node";
import { app } from "./app";
import { configureHyperdrive, type HyperdriveBinding } from "./affiliateStore";

const API_PORT = 3000;
const expressServer = createServer(app);
expressServer.listen(API_PORT);
const expressHandler = httpServerHandler({ port: API_PORT });

type Env = {
  ASSETS: { fetch(request: Request): Promise<Response> };
  HYPERDRIVE?: HyperdriveBinding;
};

export default {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      configureHyperdrive(env.HYPERDRIVE);
      return expressHandler.fetch(request, env, ctx as never);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (url.pathname === "/owner-dashboard" || url.pathname.startsWith("/owner-dashboard/")) {
      const response = new Response(assetResponse.body, assetResponse);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    return assetResponse;
  },
};
