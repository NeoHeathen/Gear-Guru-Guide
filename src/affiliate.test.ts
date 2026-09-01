import { describe, expect, it } from "vitest";
import { affiliateActivationChecklist, buildAmazonSearchLink } from "./affiliate";

describe("affiliate-link preparation", () => {
  it("stays inactive until a valid Associates tracking ID is supplied", () => {
    expect(buildAmazonSearchLink("Garmin GPSMAP 67i")).toBeNull();
    expect(buildAmazonSearchLink("Garmin GPSMAP 67i", "not allowed!")) .toBeNull();
  });

  it("creates a tagged search URL only with intentional owner input", () => {
    expect(buildAmazonSearchLink("Garmin GPSMAP 67i", "gearguru-20")).toBe(
      "https://www.amazon.com/s?k=Garmin+GPSMAP+67i&tag=gearguru-20",
    );
  });

  it("requires disclosure and current-data checks before activation", () => {
    expect(affiliateActivationChecklist.join(" ")).toMatch(/disclosure/i);
    expect(affiliateActivationChecklist.join(" ")).toMatch(/current product data/i);
  });
});
