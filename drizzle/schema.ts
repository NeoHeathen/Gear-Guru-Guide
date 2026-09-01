import { bigint, boolean, index, int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Owner-only records; destination URLs are never returned by public catalog endpoints. */
export const affiliateLinkRecords = mysqlTable("affiliate_link_records", {
  id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
  productId: int("productId").notNull().unique(),
  merchant: varchar("merchant", { length: 120 }).notNull().default("Amazon"),
  destinationUrl: text("destinationUrl").notNull(),
  videoUrl: varchar("videoUrl", { length: 2048 }),
  featuredOnYoutube: boolean("featuredOnYoutube").notNull().default(false),
  isActive: boolean("isActive").notNull().default(false),
  notes: text("notes"),
  lastCheckedAt: bigint("lastCheckedAt", { mode: "number" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("idx_affiliate_link_featured").on(table.featuredOnYoutube),
  index("idx_affiliate_link_active").on(table.isActive),
]);
