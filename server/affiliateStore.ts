import { createPool, RowDataPacket } from "mysql2/promise";

export type AffiliateLinkRecord = {
  id: number;
  productId: number;
  merchant: string;
  destinationUrl: string;
  videoUrl: string | null;
  featuredOnYoutube: boolean;
  isActive: boolean;
  notes: string | null;
  lastCheckedAt: number | null;
  updatedAt: string;
};

export type PublicVideoReview = Pick<AffiliateLinkRecord, "productId" | "videoUrl" | "featuredOnYoutube">;
export type PublicAffiliateOffer = Pick<AffiliateLinkRecord, "productId" | "merchant" | "destinationUrl">;

export type AffiliateLinkInput = {
  productId: number;
  merchant?: string;
  destinationUrl: string;
  videoUrl?: string | null;
  featuredOnYoutube?: boolean;
  isActive?: boolean;
  notes?: string | null;
  lastCheckedAt?: number | null;
};

export type HyperdriveBinding = {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
};

let pool: ReturnType<typeof createPool> | undefined;
let hyperdrive: HyperdriveBinding | undefined;

export function configureHyperdrive(binding: HyperdriveBinding | undefined) {
  if (hyperdrive === binding) return;
  hyperdrive = binding;
  pool = undefined;
}

function getPool() {
  if (pool) return pool;

  if (hyperdrive) {
    pool = createPool({
      host: hyperdrive.host,
      user: hyperdrive.user,
      password: hyperdrive.password,
      database: hyperdrive.database,
      port: hyperdrive.port,
      disableEval: true,
      connectionLimit: 1,
    });
    return pool;
  }

  if (!process.env.DATABASE_URL) throw new Error("Database is not configured.");
  pool = createPool(process.env.DATABASE_URL);
  return pool;
}

export function validateAffiliateLinkInput(input: AffiliateLinkInput) {
  if (!Number.isInteger(input.productId) || input.productId < 1) throw new Error("A valid catalog product is required.");
  if (!input.destinationUrl || !/^https:\/\//iu.test(input.destinationUrl)) throw new Error("Affiliate destinations must use HTTPS.");
  if (input.videoUrl && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//iu.test(input.videoUrl)) throw new Error("Video reviews must use a YouTube URL.");
  const merchant = input.merchant?.trim() || "Amazon";
  if (/^amazon(?:\s+associates)?$/iu.test(merchant)) {
    let url: URL;
    try { url = new URL(input.destinationUrl); } catch { throw new Error("Affiliate destinations must use a valid HTTPS URL."); }
    const host = url.hostname.toLowerCase(); const isAmazonDomain = /(^|\.)amazon\.[a-z.]+$/u.test(host); const isAmazonShortLink = host === "amzn.to";
    if (!isAmazonDomain && !isAmazonShortLink) throw new Error("Amazon records must use a direct Amazon Special Link or an approved amzn.to short link.");
    if (isAmazonDomain && !url.searchParams.get("tag")) throw new Error("Direct Amazon Special Links must include the approved Associates tracking tag.");
  }
}

function toAffiliateRecord(row: RowDataPacket): AffiliateLinkRecord {
  return {
    id: Number(row.id), productId: Number(row.productId), merchant: row.merchant, destinationUrl: row.destinationUrl,
    videoUrl: row.videoUrl, featuredOnYoutube: Boolean(row.featuredOnYoutube), isActive: Boolean(row.isActive), notes: row.notes,
    lastCheckedAt: row.lastCheckedAt === null ? null : Number(row.lastCheckedAt), updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

export async function listAffiliateLinks() {
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT * FROM affiliate_link_records ORDER BY updatedAt DESC");
  return rows.map(toAffiliateRecord);
}

export async function listPublicVideoReviews(): Promise<PublicVideoReview[]> {
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT productId, videoUrl, featuredOnYoutube FROM affiliate_link_records WHERE featuredOnYoutube = 1 AND videoUrl IS NOT NULL");
  return rows.map((row) => ({ productId: Number(row.productId), videoUrl: row.videoUrl, featuredOnYoutube: true }));
}

export async function listPublicAffiliateOffers(): Promise<PublicAffiliateOffer[]> {
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT productId, merchant, destinationUrl FROM affiliate_link_records WHERE isActive = 1");
  return rows.map((row) => ({ productId: Number(row.productId), merchant: String(row.merchant), destinationUrl: String(row.destinationUrl) }));
}

export async function upsertAffiliateLink(input: AffiliateLinkInput) {
  validateAffiliateLinkInput(input);
  await getPool().execute(
    `INSERT INTO affiliate_link_records (productId, merchant, destinationUrl, videoUrl, featuredOnYoutube, isActive, notes, lastCheckedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE merchant = VALUES(merchant), destinationUrl = VALUES(destinationUrl), videoUrl = VALUES(videoUrl), featuredOnYoutube = VALUES(featuredOnYoutube), isActive = VALUES(isActive), notes = VALUES(notes), lastCheckedAt = VALUES(lastCheckedAt)`,
    [input.productId, input.merchant?.trim() || "Amazon", input.destinationUrl.trim(), input.videoUrl?.trim() || null, input.featuredOnYoutube ? 1 : 0, input.isActive ? 1 : 0, input.notes?.trim() || null, input.lastCheckedAt || null],
  );
}

export async function deleteAffiliateLink(productId: number) {
  await getPool().execute("DELETE FROM affiliate_link_records WHERE productId = ?", [productId]);
}
