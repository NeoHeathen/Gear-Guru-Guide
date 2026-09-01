import { FormEvent, useEffect, useMemo, useState } from "react";
import { launchProducts } from "./catalog";

type LinkRecord = { productId: number; merchant: string; destinationUrl: string; videoUrl: string | null; featuredOnYoutube: boolean; isActive: boolean; notes: string | null; lastCheckedAt: number | null; updatedAt: string };
type Navigate = (route: "home") => void;

const emptyRecord = { productId: 1, merchant: "Amazon", destinationUrl: "", videoUrl: "", featuredOnYoutube: false, isActive: false, notes: "" };

export function OwnerDashboard({ navigate }: { navigate: Navigate }) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [records, setRecords] = useState<LinkRecord[]>([]);
  const [draft, setDraft] = useState(emptyRecord);
  const [status, setStatus] = useState("");
  const product = useMemo(() => launchProducts.find((item) => item.id === Number(draft.productId)), [draft.productId]);

  const headers = () => ({ "Content-Type": "application/json", "x-gearguru-admin-password": password });
  const loadRecords = async () => {
    const response = await fetch("/api/admin/affiliate-links", { headers: headers() });
    if (!response.ok) throw new Error("Your owner password was not accepted.");
    setRecords(await response.json());
  };
  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setStatus("Checking access…");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { setStatus("Access was not granted. Check the owner password and try again."); return; }
    try { await loadRecords(); setAuthenticated(true); setStatus("Owner access confirmed. Affiliate destinations remain private."); } catch (error) { setStatus(error instanceof Error ? error.message : "Could not load records."); }
  };
  useEffect(() => { if (!authenticated) return; void loadRecords().catch(() => setStatus("Could not refresh private records.")); }, [authenticated]);
  const editRecord = (record: LinkRecord) => setDraft({ productId: record.productId, merchant: record.merchant, destinationUrl: record.destinationUrl, videoUrl: record.videoUrl || "", featuredOnYoutube: record.featuredOnYoutube, isActive: record.isActive, notes: record.notes || "" });
  const saveRecord = async (event: FormEvent) => {
    event.preventDefault(); setStatus("Saving private record…");
    const response = await fetch("/api/admin/affiliate-links", { method: "PUT", headers: headers(), body: JSON.stringify({ ...draft, productId: Number(draft.productId), videoUrl: draft.videoUrl || null, notes: draft.notes || null, lastCheckedAt: Date.now() }) });
    if (!response.ok) { const result = await response.json().catch(() => ({})); setStatus(result.error || "The record could not be saved."); return; }
    await loadRecords(); setStatus("Saved. The link is private; only YouTube review metadata can appear in the public filter.");
  };
  const removeRecord = async (productId: number) => {
    if (!window.confirm("Remove this private affiliate-link record?")) return;
    const response = await fetch(`/api/admin/affiliate-links/${productId}`, { method: "DELETE", headers: headers() });
    if (!response.ok) { setStatus("The record could not be removed."); return; }
    await loadRecords(); setStatus("Private record removed.");
  };

  if (!authenticated) return <main className="admin-shell"><section className="admin-login"><p className="eyebrow"><span /> PRIVATE OWNER ACCESS</p><h1>Affiliate link<br /><em>control room.</em></h1><p>This non-public route stores affiliate destinations on the server. It does not appear in site navigation or the public catalog.</p><form onSubmit={signIn}><label>OWNER PASSWORD<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label><button className="button button-bright" type="submit">Unlock dashboard <span>↗</span></button><p role="status">{status || "Use the owner password configured for Gear Guru Guide."}</p></form><button className="back-link" onClick={() => navigate("home")}>← BACK TO THE PUBLIC SITE</button></section></main>;
  return <main className="admin-shell"><section className="admin-topbar"><div><p className="eyebrow"><span /> OWNER DASHBOARD</p><h1>Manage private<br /><em>affiliate records.</em></h1><p>Affiliate destinations never load into public catalog cards. Mark a product as “Featured on YouTube” only after its review video is live.</p></div><button className="button button-outline" onClick={() => navigate("home")}>View public site <span>↗</span></button></section><section className="admin-layout"><form className="admin-editor" onSubmit={saveRecord}><div className="form-heading"><p>LINK EDITOR</p><h2>Approved destination</h2></div><aside className="admin-preflight"><strong>AMAZON PRE-FLIGHT</strong><span>Save only after acceptance. Direct Amazon links need your approved tracking tag; activate public placements only with a near-link disclosure and current approved product data.</span></aside><label>CATALOG PRODUCT<select value={draft.productId} onChange={(event) => setDraft({ ...draft, productId: Number(event.target.value) })}>{launchProducts.map((item) => <option key={item.id} value={item.id}>{String(item.id).padStart(3, "0")} — {item.maker} {item.model}</option>)}</select></label><p className="admin-product-context">{product ? `${product.category} / ${product.focus}` : "Choose a catalog product."}</p><label>MERCHANT<input value={draft.merchant} onChange={(event) => setDraft({ ...draft, merchant: event.target.value })} required /></label><label>APPROVED AFFILIATE URL <small>Amazon direct links need a `tag` parameter; approved `amzn.to` links are also accepted.</small><input type="url" value={draft.destinationUrl} onChange={(event) => setDraft({ ...draft, destinationUrl: event.target.value })} placeholder="https://" required /></label><label>YOUTUBE REVIEW URL <small>Optional, but required to feature the product publicly.</small><input type="url" value={draft.videoUrl} onChange={(event) => setDraft({ ...draft, videoUrl: event.target.value })} placeholder="https://www.youtube.com/watch?v=" /></label><label className="admin-toggle"><input type="checkbox" checked={draft.featuredOnYoutube} onChange={(event) => setDraft({ ...draft, featuredOnYoutube: event.target.checked })} />FEATURED ON YOUTUBE</label><label className="admin-toggle"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} />ACTIVE LINK RECORD</label><label>PRIVATE NOTES<textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={4} placeholder="Source date, video status, or review notes. Never shown publicly." /></label><button className="button button-bright" type="submit">Save private record <span>↗</span></button><p className="admin-status" role="status">{status}</p></form><section className="admin-records"><div className="admin-records-heading"><div><p>PRIVATE RECORDS</p><h2>{records.length} saved links</h2></div><button className="back-link" onClick={() => { setDraft(emptyRecord); setStatus("Ready to create a new private record."); }}>+ NEW RECORD</button></div><div className="admin-table-wrap"><table><thead><tr><th>Product</th><th>Merchant</th><th>YouTube</th><th>Checked</th><th>Manage</th></tr></thead><tbody>{records.map((record) => { const item = launchProducts.find((entry) => entry.id === record.productId); return <tr key={record.productId}><td><strong>{item?.maker} {item?.model}</strong><span>{record.isActive ? "Active private record" : "Draft record"}</span></td><td>{record.merchant}</td><td>{record.featuredOnYoutube ? "Featured" : "—"}</td><td>{record.lastCheckedAt ? new Date(record.lastCheckedAt).toLocaleDateString() : "—"}</td><td><button onClick={() => editRecord(record)}>Edit</button><button onClick={() => void removeRecord(record.productId)}>Remove</button></td></tr>; })}</tbody></table>{records.length === 0 && <p className="admin-empty">No private affiliate records yet. Add only links generated through your approved affiliate account.</p>}</div></section></section></main>;
}
