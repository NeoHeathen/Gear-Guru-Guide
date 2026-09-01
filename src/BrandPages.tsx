import { FormEvent, useState } from "react";
import { launchProducts } from "./catalog";

type BrandRoute = "home" | "guides" | "brands" | "work-with-us";
type Navigate = (route: BrandRoute) => void;

const directoryBrands = Array.from(
  new Map(
    launchProducts.map((product) => [
      product.maker,
      {
        name: product.maker,
        category: product.category,
        note: `${product.category} systems represented in the active research catalog`,
      },
    ]),
  ).values(),
).sort((left, right) => left.name.localeCompare(right.name));

export function BrandDirectory({ navigate }: { navigate: Navigate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(directoryBrands.map((brand) => brand.category)))];
  const visibleBrands = directoryBrands.filter((brand) => (activeCategory === "All" || brand.category === activeCategory) && brand.name.toLowerCase().includes(query.trim().toLowerCase()));

  return <main className="page-main"><section className="directory-hero"><p className="eyebrow"><span /> BRAND DIRECTORY</p><h1>Research by<br /><em>the builder.</em></h1><p>Explore the manufacturers on Gear Guru Guide’s research map. Inclusion signals an editorial topic, not a paid placement, endorsement, or recommendation.</p><button className="button button-bright" onClick={() => navigate("work-with-us")}>Work with Gear Guru Guide <span>↗</span></button></section><section className="directory-main"><div className="directory-intro"><p>BRAND INDEX / {directoryBrands.length} RESEARCH TRACKS</p><span>Our watchlist changes as products, evidence, and real-world category needs change.</span></div><div className="brand-controls"><label>SEARCH A BRAND<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Garmin, MSR, Starlink" /></label><div className="brand-filters" aria-label="Filter brands by category">{categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div><div className="brand-directory-grid">{visibleBrands.map((brand, index) => { const entries = launchProducts.filter((product) => product.maker === brand.name).length; return <article className="brand-directory-card" key={brand.name}><span>{String(index + 1).padStart(2, "0")}</span><p>{brand.category}</p><h2>{brand.name}</h2><div><small>{entries > 0 ? `${entries} research ${entries === 1 ? "entry" : "entries"}` : "Category planned"}</small><em>{brand.note}</em></div></article>; })}</div>{visibleBrands.length === 0 && <p className="brand-empty">No brand matches that search yet. Use the partnership form to introduce a premium outdoor brand for editorial consideration.</p>}</section></main>;
}

export function WorkWithUs({ navigate }: { navigate: Navigate }) {
  const [intent, setIntent] = useState("Product review consideration");
  const [brandName, setBrandName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!brandName.trim() || !contactEmail.trim() || !website.trim()) {
      setStatus("Please add your brand, work email, and website so we can route your inquiry.");
      return;
    }
    const subject = encodeURIComponent(`Gear Guru Guide inquiry: ${intent} — ${brandName.trim()}`);
    const body = encodeURIComponent(`Brand: ${brandName.trim()}\nContact: ${contactEmail.trim()}\nWebsite: ${website.trim()}\nInquiry: ${intent}\n\nNotes:\n${note.trim()}`);
    setStatus("Your email application should open with the inquiry details. Sending an inquiry does not guarantee coverage, sponsorship, or endorsement.");
    window.location.href = `mailto:partners@gearguruguide.com?subject=${subject}&body=${body}`;
  };

  return <main className="page-main"><section className="partner-hero"><p className="eyebrow"><span /> PARTNER INQUIRIES</p><h1>Work with the<br /><em>signal.</em></h1><p>Gear Guru Guide considers product-review, sponsorship, and endorsement inquiries from brands building capable outdoor systems. The editorial verdict is never for sale.</p></section><section className="partner-layout"><aside className="partner-principles"><p>NON-NEGOTIABLE</p><h2>Clear labels.<br />Independent calls.</h2><div><span>01</span><p>Sponsored work is disclosed clearly and never buys a favorable conclusion.</p></div><div><span>02</span><p>Product consideration does not guarantee a feature, review, or publication date.</p></div><div><span>03</span><p>Endorsements are considered only after independent editorial evaluation.</p></div></aside><form className="partner-form" onSubmit={submitInquiry} noValidate><div className="form-heading"><p>START A CONVERSATION</p><h2>Tell us what you are building.</h2></div><fieldset><legend>Inquiry type</legend>{["Product review consideration", "Sponsorship", "Endorsement / ambassador", "Other"].map((option) => <label key={option} className={intent === option ? "choice active" : "choice"}><input type="radio" name="intent" value={option} checked={intent === option} onChange={() => setIntent(option)} />{option}</label>)}</fieldset><label>Brand or organization<input value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Your brand name" required /></label><label>Work email<input value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} type="email" placeholder="name@brand.com" required /></label><label>Website<input value={website} onChange={(event) => setWebsite(event.target.value)} type="url" placeholder="https://" required /></label><label>What would you like to discuss?<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="A concise product, campaign, or partnership overview." rows={5} /></label><button className="button button-bright" type="submit">Prepare inquiry <span>↗</span></button><p className="partner-status" role="status">{status || "The form opens your email application; no data is stored through this page."}</p><button className="back-link" type="button" onClick={() => navigate("brands")}>← BACK TO BRAND DIRECTORY</button></form></section></main>;
}
