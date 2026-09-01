# Adding Products to Gear Guru Guide

The current catalog is centralized in `src/catalog.ts`, so adding a product is straightforward and does not require changing page layout, fonts, or colors.

## Add one catalog entry

Copy an existing object in `launchProducts` and change these fields:

```ts
{ id: 101, maker: "Brand", model: "Model Name", category: "Power", focus: "Short decision-use description", status: "Research queue", commerceRoute: direct },
```

Allowed categories are: `Mobility`, `Navigation`, `Power`, `Capture`, `Shelter`, `Camp`, and `Connectivity`.

Allowed status values are: `Research queue`, `Guide in development`, and `Field brief ready`.

Use the next unused numeric ID. The home catalog and filters populate automatically from this array.

## Add a product image later

Use the included `public/product-images/gear-guru-square-placeholder-1200.png` as the composition guide. Recommended source dimensions are 1200 × 1200. Keep one consistent crop and subject scale across the catalog.

The current public cards intentionally use the existing abstract CSS artwork, so no design change has been forced into this build. Product photography can be introduced later as an optional field without redesigning typography or colors.

## Affiliate link later

Do not hard-code affiliate destinations into `catalog.ts`. The project already separates those into the private owner dashboard and server-side store so public editorial data stays clean.
