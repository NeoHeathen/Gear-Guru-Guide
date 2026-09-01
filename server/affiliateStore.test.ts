import { describe, expect, it } from "vitest";
import { validateAffiliateLinkInput } from "./affiliateStore";

describe("affiliate-link validation", () => {
  it("accepts a valid tagged Amazon Special Link with an optional YouTube review", () => {
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://www.amazon.com/dp/example?tag=gearguru-20", videoUrl: "https://www.youtube.com/watch?v=example" })).not.toThrow();
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://amzn.to/example" })).not.toThrow();
  });

  it("rejects unsafe destinations, missing Amazon tracking tags, and non-YouTube video URLs", () => {
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "http://example.com" })).toThrow(/HTTPS/);
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://www.amazon.com/dp/example" })).toThrow(/tracking tag/);
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "Amazon", destinationUrl: "https://example.com/affiliate?tag=gearguru-20" })).toThrow(/Amazon records/);
    expect(() => validateAffiliateLinkInput({ productId: 1, merchant: "ShareASale", destinationUrl: "https://example.com", videoUrl: "https://vimeo.com/123" })).toThrow(/YouTube/);
  });
});
