import { describe, expect, it } from "vitest";
import { validateAffiliateLinkInput } from "./affiliateStore";

describe("affiliate-link validation", () => {
  it("accepts valid inactive affiliate destinations", () => {
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://www.amazon.com/dp/example?tag=gearguru-20", videoUrl: "https://www.youtube.com/watch?v=example" })).not.toThrow();
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://amzn.to/example" })).not.toThrow();
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "https://example.com/offer" })).not.toThrow();
  });

  it("requires current verified provenance before activation", () => {
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "https://example.com/offer", isActive: true })).toThrow(/current verification timestamp/);
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "https://example.com/offer", isActive: true, lastCheckedAt: Date.now(), notes: "Verified source: merchant dashboard export 2026-09-01" })).not.toThrow();
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "https://example.com/offer", isActive: true, lastCheckedAt: Date.now() - (91 * 24 * 60 * 60 * 1000), notes: "Verified source: merchant dashboard export" })).toThrow(/current verification timestamp/);
  });

  it("rejects unsafe destinations, missing Amazon tracking tags, and non-YouTube video URLs", () => {
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "http://example.com" })).toThrow(/HTTPS/);
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://www.amazon.com/dp/example" })).toThrow(/tracking tag/);
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://example.com/affiliate?tag=gearguru-20" })).toThrow(/Amazon records/);
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "https://example.com", videoUrl: "https://vimeo.com/123" })).toThrow(/YouTube/);
  });
});
