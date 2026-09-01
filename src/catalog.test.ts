import { describe, expect, it } from "vitest";
import { catalogCount, getProductsByCategory, getProductsForFilter, launchProducts, productCategories } from "./catalog";

describe("launch catalog", () => {
  it("contains five hundred non-duplicated premium research products", () => {
    expect(catalogCount).toBe(500);
    expect(launchProducts).toHaveLength(500);
    expect(new Set(launchProducts.map((product) => `${product.maker}-${product.model}`)).size).toBe(500);
    expect(new Set(launchProducts.map((product) => product.maker)).size).toBe(85);
  });

  it("covers each planned editorial category", () => {
    productCategories.forEach((category) => {
      expect(getProductsByCategory(category).length).toBeGreaterThan(0);
    });
  });

  it("keeps only documented publisher status in data and prevents active offer claims", () => {
    expect(launchProducts.every((product) => ["Direct publisher application", "Retailer publisher application", "Editorial research only"].includes(product.commerceRoute))).toBe(true);
    expect(launchProducts.every((product) => /^https:\/\//.test(product.officialSource))).toBe(true);
    expect(launchProducts.find((product) => product.maker === "Starlink")?.commerceRoute).toBe("Editorial research only");
    expect(getProductsByCategory("Connectivity").every((product) => product.commerceRoute === "Editorial research only")).toBe(true);
    expect(JSON.stringify(launchProducts)).not.toMatch(/amazon\.com|rating|review|commission|price/iu);
  });

  it("filters featured YouTube products only from persisted owner review metadata", () => {
    expect(getProductsForFilter("YouTube", [1, 103]).map((product) => product.id)).toEqual([1, 103]);
    expect(getProductsForFilter("YouTube", [])).toEqual([]);
  });
});
