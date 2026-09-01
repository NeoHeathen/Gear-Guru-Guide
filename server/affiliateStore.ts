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

const MAX_VERIFICATION_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const VERIFIED_SOURCE_PREFIX = /^Verified source:\s*\S+/iu;

let pool: ReturnType<typeof createPool> | undefined;

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured.");
  pool ??= createPool(process.env.DATABASE_URL);
  return pool;
}

function hasCurrentVerification(input: AffiliateLinkInput) {
  const checkedAt = input.lastCheckedAt;
  const notes = input.notes?.trim() || "";
  if (!checkedAt || !Number.isFinite(checkedAt)) return false;
  const age = Date.now() - checkedAt;
  return age >= 0 && age <= MAX_VERIFICATION_AGE_MS && VERIFIED_SOURCE_PREFIX.test(notes);
}

export function validateAffiliateLinkInput(input: AffiliateLinkInput) {
  if (!Number.isInteger(input.productId) || input.productId < 1) throw new Error("A valid catalog product is required.");
  if (!input.destinationUrl || !/^https:\/\//iu.test(input.destinationUrl)) throw new Error("Affiliate destinations must use HTTPS.");
  if (input.videoUrl && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//iu.test(input.videoUrl)) throw new Error("Video reviews must use a YouTube URL.");
  if (input.isActive && !hasCurrentVerification(input)) throw new Error("Active affiliate links require a current verification timestamp and private notes beginning with 'Verified source:' followed by the verified provenance.");
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
  const cutoff = Date.now() - MAX_VERIFICATION_AGE_MS;
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT productId, merchant, destinationUrl FROM affiliate_link_records WHERE isActive = 1 AND lastCheckedAt >= ? AND notes LIKE 'Verified source:%'", [cutoff]);
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
