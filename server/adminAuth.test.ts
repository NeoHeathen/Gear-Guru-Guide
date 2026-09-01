import { describe, expect, it } from "vitest";
import { createAdminAccessHandler } from "./adminAuth";

describe("owner dashboard password endpoint", () => {
  it("accepts the configured owner password without exposing its value", () => {
    const configuredPassword = process.env.ADMIN_DASHBOARD_PASSWORD;
    expect(configuredPassword).toBeTruthy();

    const response = createAdminAccessHandler({ password: configuredPassword });

    expect(response).toEqual({ status: 200, body: { ok: true } });
  });

  it("rejects an incorrect password", () => {
    const response = createAdminAccessHandler({ password: "incorrect-owner-password" });

    expect(response).toEqual({ status: 401, body: { ok: false } });
  });
});
