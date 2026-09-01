import { timingSafeEqual } from "node:crypto";

type AdminAccessResponse = { status: 200 | 401; body: { ok: boolean } };

function sameSecret(candidate: string, expected: string) {
  const candidateBuffer = Buffer.from(candidate, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (candidateBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

export function verifyAdminDashboardPassword(candidate: string) {
  const configuredPassword = process.env.ADMIN_DASHBOARD_PASSWORD;
  return Boolean(configuredPassword && candidate && sameSecret(candidate, configuredPassword));
}

/** Lightweight server handler used by the dashboard login endpoint. */
export function createAdminAccessHandler(input: { password?: string }): AdminAccessResponse {
  return verifyAdminDashboardPassword(input.password ?? "")
    ? { status: 200, body: { ok: true } }
    : { status: 401, body: { ok: false } };
}
