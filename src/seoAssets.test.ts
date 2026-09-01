import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("crawlable public SEO assets", () => {
  it("publishes a robots file that points crawlers to the Gear Guru sitemap and keeps the owner route out of indexing", () => {
    const robots = readFileSync(resolve(projectRoot, "public/robots.txt"), "utf8");
    expect(robots).toContain("Sitemap: https://gearguruguide.com/sitemap.xml");
    expect(robots).toContain("Disallow: /owner-dashboard");
  });

  it("lists the public guide and policy URLs in the sitemap without including the private owner dashboard", () => {
    const sitemap = readFileSync(resolve(projectRoot, "public/sitemap.xml"), "utf8");
    expect(sitemap).toContain("https://gearguruguide.com/guide/exoskeletons");
    expect(sitemap).toContain("https://gearguruguide.com/policy/affiliate-disclosure");
    expect(sitemap).not.toContain("owner-dashboard");
  });
});
