import { FormEvent, useEffect, useMemo, useState } from "react";
import { CatalogFilter, catalogCount, getProductsForFilter, launchProducts, productCategories } from "./catalog";
import { guides, policies, Guide, Policy } from "./content";
import { BrandDirectory, WorkWithUs } from "./BrandPages";
import { OwnerDashboard } from "./OwnerDashboard";
import { BlogHub, BlogPostPage, blogPosts } from "./BlogPages";

type Route = "home" | "guides" | "blog" | "brands" | "work-with-us" | "owner-dashboard" | `guide/${Guide["slug"]}` | `blog/${string}` | `policy/${Policy["slug"]}`;
type PublicAffiliateOffer = { productId: number; merchant: string; destinationUrl: string };

const canonicalOrigin = "https://gearguruguide.com";
const navItems = ["Field Notes", "Buying Guides", "Blog", "Signal", "About"];

function routePath(route: Route) { return route === "home" ? "/" : `/${route}`; }

function currentRoute(): Route {
  const legacyHash = window.location.hash.replace(/^#\/?/, "");
  if (legacyHash && window.location.pathname === "/") {
    window.history.replaceState({}, "", `/${legacyHash}`);
    return legacyHash as Route;
  }
  return (window.location.pathname.replace(/^\/+|\/+$/gu, "") || "home") as Route;
}

function scrollToSection(id: string) {
  window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
}

function fetchPublicAffiliateOffers() {
  return fetch("/api/catalog/affiliate-offers")
    .then((response) => response.ok ? response.json() : [])
    .then((records: PublicAffiliateOffer[]) => Array.isArray(records) ? records : [])
    .catch(() => [] as PublicAffiliateOffer[]);
}

function setDocumentMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function getPageMetadata(route: Route) {
  if (route.startsWith("guide/")) {
    const guide = guides.find((entry) => route === `guide/${entry.slug}`);
    if (guide) return { title: `${guide.title} | Gear Guru Guide`, description: guide.dek, kind: "Article" };
  }
  if (route === "guides") return { title: "Premium Outdoor Buying Guides | Gear Guru Guide", description: "Original decision frameworks for powered mobility, portable power, and satellite communication.", kind: "CollectionPage" };
  if (route === "blog") return { title: "Outdoor Gear Blog | Gear Guru Guide", description: "Evergreen outdoor gear advice, buying strategy, field systems, portable power, satellite communication, and powered mobility.", kind: "CollectionPage" };
  if (route.startsWith("blog/")) { const post = blogPosts.find((entry) => route === `blog/${entry.slug}`); if (post) return { title: `${post.title} | Gear Guru Guide`, description: post.dek, kind: "Article" }; }
  if (route === "brands") return { title: "Outdoor Gear Brand Directory | Gear Guru Guide", description: "Search premium outdoor brands by category and explore independent research coverage.", kind: "CollectionPage" };
  if (route === "work-with-us") return { title: "Work With Gear Guru Guide | Partnerships", description: "Product review, sponsorship, and ambassador inquiries under a documented editorial-independence policy.", kind: "WebPage" };
  if (route.startsWith("policy/")) {
    const policy = policies.find((entry) => route === `policy/${entry.slug}`);
    if (policy) return { title: `${policy.title} | Gear Guru Guide`, description: policy.intro, kind: "WebPage" };
  }
  return { title: "Gear Guru Guide | Premium Outdoor Gear Intelligence", description: "Field notes and buying guides for premium outdoor technology, from powered mobility to satellite communication.", kind: "WebSite" };
}

function PageMetadata({ route }: { route: Route }) {
  useEffect(() => {
    const metadata = getPageMetadata(route);
    const canonical = `${canonicalOrigin}${routePath(route)}`;
    document.title = metadata.title;
    setDocumentMeta("name", "description", metadata.description);
    setDocumentMeta("name", "robots", route === "owner-dashboard" ? "noindex,nofollow" : "index,follow");
    setDocumentMeta("property", "og:title", metadata.title);
    setDocumentMeta("property", "og:description", metadata.description);
    setDocumentMeta("property", "og:type", route.startsWith("guide/") || route.startsWith("blog/") ? "article" : "website");

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) { canonicalLink = document.createElement("link"); canonicalLink.rel = "canonical"; document.head.appendChild(canonicalLink); }
    canonicalLink.href = canonical;

    document.getElementById("gear-guru-page-schema")?.remove();
    if (route !== "owner-dashboard") {
      const script = document.createElement("script");
      script.id = "gear-guru-page-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": metadata.kind, name: metadata.title, description: metadata.description, url: canonical, isPartOf: { "@type": "WebSite", name: "Gear Guru Guide", url: canonicalOrigin } });
      document.head.appendChild(script);
    }
  }, [route]);
  return null;
}

function Header({ navigate }: { navigate: (route: Route) => void }) {
  const handleNav = (item: string) => {
    if (item === "Buying Guides") navigate("guides");
    else if (item === "Blog") navigate("blog");
    else { navigate("home"); scrollToSection(item === "Signal" ? "signal" : item === "About" ? "about" : "field-notes"); }
  };
  return <header className="site-header" aria-label="Primary navigation">
    <button className="brand" onClick={() => navigate("home")} aria-label="Gear Guru Guide home"><span className="brand-mark" aria-hidden="true">GG</span><span>GEAR GURU<br />GUIDE</span></button>
    <nav>{navItems.map((item) => <button key={item} onClick={() => handleNav(item)}>{item}</button>)}<button onClick={() => navigate("brands")}>Brands</button></nav>
    <button className="nav-cta" onClick={() => { navigate("home"); scrollToSection("signal"); }}>Get the field brief <span>↗</span></button>
  </header>;
}

function Footer({ navigate }: { navigate: (route: Route) => void }) {
  const [hasAmazonOffers, setHasAmazonOffers] = useState(false);
  useEffect(() => { void fetchPublicAffiliateOffers().then((offers) => setHasAmazonOffers(offers.some((offer) => /^amazon(?:\s+associates)?$/iu.test(offer.merchant)))); }, []);

  const disclosure = hasAmazonOffers
    ? <>As an Amazon Associate I earn from qualifying purchases. Some activated recommendations may contain affiliate links, clearly disclosed beside the link. Gear is not a substitute for training, sound judgment, weather awareness, or applicable land and safety rules.</>
    : <>Gear Guru Guide is an independent editorial publication. Commercial relationships and affiliate links are clearly identified when they appear and do not determine editorial conclusions. Gear is not a substitute for training, sound judgment, weather awareness, or applicable land and safety rules.</>;

  return <footer><div className="footer-brand"><span className="brand-mark">GG</span><p>GEAR GURU GUIDE<br /><small>GO FARTHER. DECIDE BETTER.</small></p></div><div className="footer-detail"><p className="disclosure">{disclosure}</p><div className="footer-links">{policies.map((policy) => <button key={policy.slug} onClick={() => navigate(`policy/${policy.slug}`)}>{policy.title}</button>)}<button onClick={() => navigate("blog")}>Blog</button><button onClick={() => navigate("work-with-us")}>Business &amp; Sponsorship</button></div></div><p className="copyright">© 2026 GEAR GURU GUIDE</p></footer>;
}

function GuidePage({ guide, navigate }: { guide: Guide; navigate: (route: Route) => void }) {
  const relatedProducts = launchProducts.filter((product) => guide.relatedProductIds.includes(product.id));
  return <><Header navigate={navigate} /><main className="page-main"><section className="article-hero"><p className="eyebrow"><span /> {guide.kicker}</p><p className="article-meta">{guide.readTime} <b>•</b> UPDATED {guide.updated}</p><h1>{guide.title}</h1><p className="article-dek">{guide.dek}</p><div className="article-rule"><span>GEAR GURU GUIDE</span><span>FIELD-LED, NOT HYPE-LED</span></div></section><article className="article-layout"><aside className="article-aside sticky-toc"><button className="back-link" onClick={() => navigate("guides")}>← ALL BUYING GUIDES</button><div><p>ON THIS PAGE</p>{guide.sections.map((section, index) => <a key={section.title} href={`#section-${index}`}>{String(index + 1).padStart(2, "0")} {section.title}</a>)}<a href="#field-check">04 Field check</a><a href="#related-products">05 Related research</a><a href="#video-review">06 Video review</a><a href="#sources">07 Sources</a></div></aside><div className="article-body"><div className="thesis"><span>THE BOTTOM LINE</span><p>{guide.thesis}</p></div>{guide.sections.map((section, index) => <section id={`section-${index}`} key={section.title}><p className="article-number">0{index + 1}</p><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<section className="article-check" id="field-check"><p className="article-number">FIELD CHECK</p><h2>{guide.checklistTitle}</h2><ol>{guide.checklist.map((item) => <li key={item}>{item}</li>)}</ol></section><section className="skip-box"><p>SKIP IF…</p><strong>{guide.skipIf}</strong></section><section className="related-products" id="related-products"><div className="related-header"><div><p className="article-number">RELATED RESEARCH TRACKS</p><h2>Keep exploring the system.</h2></div><p>These are editorial research entries, not active offers. We add live product data only after the approved affiliate workflow is in place.</p></div><div className="related-grid">{relatedProducts.map((product) => <article className="related-card" key={product.id}><div className={`related-art visual-${product.category.toLowerCase()}`}><span>{String(product.id).padStart(2, "0")}</span><i /></div><p>{product.category} / {product.status}</p><h3>{product.maker} <em>{product.model}</em></h3><span>{product.focus}</span><button onClick={() => navigate("guides")}>Explore research <b>↗</b></button></article>)}</div></section><section className="video-review" id="video-review"><div className="video-review-heading"><div><p className="article-number">VIDEO REVIEW</p><h2>Watch the field brief.</h2></div><p>Video reviews are editorial companion pieces. Any material connection is disclosed in the video and description.</p></div>{guide.videoReview.youtubeId ? <div className="video-embed"><iframe src={`https://www.youtube-nocookie.com/embed/${guide.videoReview.youtubeId}`} title={`${guide.title} YouTube review`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div> : <div className="video-placeholder"><div className="video-play" aria-hidden="true">▶</div><div><p>VIDEO REVIEW IN PRODUCTION</p><h3>{guide.videoReview.plannedTitle}</h3><span>{guide.videoReview.description}</span></div><button className="button button-bright" onClick={() => { navigate("home"); scrollToSection("signal"); }}>Get the release note <b>↗</b></button></div>}</section><section className="source-list" id="sources"><h2>Sources and current-data note</h2><p>Specifications and terms may change. Confirm current manufacturer information before you purchase.</p>{guide.sources.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">[{index + 1}] {source.label} ↗</a>)}</section></div></article></main><Footer navigate={navigate} /></>;
}

function GuidesHub({ navigate }: { navigate: (route: Route) => void }) {
  return <><Header navigate={navigate} /><main className="page-main"><section className="hub-hero"><p className="eyebrow"><span /> BUYING GUIDES / ISSUE 001</p><h1>Decision tools for<br /><em>premium</em> gear.</h1><p>Our first guides focus on the categories that bring the most system complexity to a trip: powered mobility, portable power, and satellite communication.</p></section><section className="guide-card-grid">{guides.map((guide, index) => <article className="guide-card" key={guide.slug}><div className={`guide-card-index guide-index-${index + 1}`}>0{index + 1}</div><p>{guide.kicker}</p><h2>{guide.title}</h2><span>{guide.readTime}</span><button onClick={() => navigate(`guide/${guide.slug}`)}>Read the guide <b>↗</b></button></article>)}</section></main><Footer navigate={navigate} /></>;
}

function PolicyPage({ policy, navigate }: { policy: Policy; navigate: (route: Route) => void }) {
  return <><Header navigate={navigate} /><main className="page-main policy-main"><section className="policy-hero"><p className="eyebrow dark"><span /> GEAR GURU GUIDE / POLICIES</p><h1>{policy.title}</h1><p>{policy.intro}</p><small>Last updated: August 2026</small></section><article className="policy-body">{policy.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}{policy.slug === "affiliate-disclosure" && <aside className="policy-callout"><strong>Required Amazon statement when Amazon links are active:</strong> As an Amazon Associate I earn from qualifying purchases.</aside>}{policy.slug === "contact" && <aside className="policy-callout"><strong>Launch requirement:</strong> Activate and monitor a public contact mailbox before submitting the Associates application.</aside>}</article></main><Footer navigate={navigate} /></>;
}

function AffiliateOffer({ offer }: { offer: PublicAffiliateOffer }) {
  return <div className="affiliate-offer" data-testid={`affiliate-offer-${offer.productId}`}>
    <p><strong>Affiliate disclosure:</strong> Gear Guru Guide may earn a commission if you buy through this link, at no extra cost to you.</p>
    <a href={offer.destinationUrl} target="_blank" rel="sponsored noopener noreferrer">View approved {offer.merchant} option <span>↗</span></a>
  </div>;
}

function Home({ navigate }: { navigate: (route: Route) => void }) {
  const [category, setCategory] = useState<CatalogFilter>("All");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [featuredReviews, setFeaturedReviews] = useState<{ productId: number }[]>([]);
  const [affiliateOffers, setAffiliateOffers] = useState<PublicAffiliateOffer[]>([]);

  useEffect(() => { fetch("/api/catalog/youtube").then((response) => response.ok ? response.json() : []).then((records) => setFeaturedReviews(Array.isArray(records) ? records : [])).catch(() => setFeaturedReviews([])); }, []);
  useEffect(() => { void fetchPublicAffiliateOffers().then(setAffiliateOffers); }, []);

  const products = useMemo(() => getProductsForFilter(category, featuredReviews.map((record) => record.productId)), [category, featuredReviews]);
  const offersByProductId = useMemo(() => new Map(affiliateOffers.map((offer) => [offer.productId, offer])), [affiliateOffers]);
  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const normalized = email.trim(); if (!/^\S+@\S+\.\S+$/.test(normalized)) { setNotice("Enter a valid email address."); return; } const subject = encodeURIComponent("Gear Guru Guide field brief signup"); const body = encodeURIComponent(`Please add ${normalized} to the Gear Guru Guide field brief list.`); setNotice("Your email app should open so you can send the signup request."); window.location.href = `mailto:hello@gearguruguide.com?subject=${subject}&body=${body}`; };

  return <><Header navigate={navigate} /><main><div className="site-shell"><section className="hero" id="top" aria-labelledby="hero-title"><div className="topo topo-a" aria-hidden="true" /><div className="topo topo-b" aria-hidden="true" /><div className="hero-copy"><p className="eyebrow"><span /> PREMIUM OUTDOOR INTELLIGENCE / ISSUE 001</p><h1 id="hero-title">GO FARTHER.<br /><em>DECIDE</em> BETTER.</h1><p className="hero-lede">Clear-eyed field notes on the new edge of outdoor gear—powered mobility, off-grid power, navigation, and the high-consideration kit worth carrying.</p><div className="hero-actions"><button className="button button-bright" onClick={() => navigate("guides")}>Read the first guides <span>↗</span></button><button className="text-link" onClick={() => scrollToSection("field-notes")}>How we evaluate gear <span>→</span></button></div></div><div className="hero-object" aria-label="Abstract terrain and mobility-system illustration"><div className="sun-orb" /><div className="range range-back" /><div className="range range-front" /><div className="exosuit"><i className="suit-core" /><i className="suit-arm arm-a" /><i className="suit-arm arm-b" /><i className="suit-leg leg-a" /><i className="suit-leg leg-b" /></div><p className="object-label">01 / POWERED MOBILITY<br /><b>THE HUMAN RANGE EXTENDER</b></p></div><div className="hero-footer"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /><span>38.8895° N / 106.9992° W</span></div></section><section className="signal-strip" aria-label="Editorial principles"><p><span className="pulse" /> NO PAY-TO-PLAY PICKS</p><p>FIELD USE OVER FEATURE LISTS</p><p>DISCLOSURES IN PLAIN SIGHT</p></section><section className="field-notes section-grid" id="field-notes"><div className="section-kicker"><span>01</span><p>FIELD NOTES</p></div><div className="feature-story"><p className="eyebrow dark"><span /> CATEGORY WATCH</p><h2>The robot legs are<br />finally at the trailhead.</h2><p>Powered exoskeletons are moving from industrial labs to day hikes. We’re mapping the real questions: fit, terrain behavior, battery logistics, fatigue, and whether the assist earns the extra complexity.</p><div className="story-meta"><span>9 MIN READ</span><span>•</span><span>POWERED MOBILITY</span></div><button className="underlined" onClick={() => navigate("guide/exoskeletons")}>Read the decision framework <span>→</span></button></div><div className="note-card note-card-a"><p className="card-index">FIELD NOTE / 01</p><h3>Assistance is not a medical claim.</h3><p>Every guide distinguishes manufacturer language, observed performance, and safe use limitations.</p><span className="card-ornament">01</span></div><div className="note-card note-card-b"><p className="card-index">FIELD NOTE / 02</p><h3>High-consideration gear needs a decision system.</h3><p>We assess the whole carry: service, weight, power, repairability, and the friction you only notice outdoors.</p><span className="card-ornament">02</span></div></section><section className="guide-callout"><p className="eyebrow"><span /> THREE CORNERSTONE GUIDES</p><div><h2>Built for the gear that changes the whole trip.</h2><p>Start with an original decision framework—not a product carousel.</p></div><div className="guide-callout-links">{guides.map((guide) => <button key={guide.slug} onClick={() => navigate(`guide/${guide.slug}`)}>{guide.kicker.replace("BUYING GUIDE / ", "")} <span>↗</span></button>)}</div></section><section className="catalog-section" id="catalog" aria-labelledby="catalog-title"><div className="catalog-topline"><p className="eyebrow"><span /> LAUNCH CATALOG</p><p>{catalogCount} RESEARCH TRACKS / EDITORIAL SELECTIONS, NOT LIVE STORE LISTINGS</p></div><div className="catalog-heading"><h2 id="catalog-title">The high-consideration<br /><em>watchlist.</em></h2><p>Starting with categories where a better purchase decision matters more than a faster checkout.</p></div><div className="filter-row" aria-label="Filter catalog by category"><button className={category === "All" ? "filter active" : "filter"} onClick={() => setCategory("All")}>All systems <sup>{catalogCount}</sup></button><button className={category === "YouTube" ? "filter active filter-youtube" : "filter filter-youtube"} onClick={() => setCategory("YouTube")}>Featured on YouTube <sup>{featuredReviews.length}</sup></button>{productCategories.map((item) => <button key={item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="product-grid">{products.map((product) => { const offer = offersByProductId.get(product.id); return <article className="product-card" key={product.id}><div className={`product-visual visual-${product.category.toLowerCase()}`} aria-hidden="true"><span>{String(product.id).padStart(2, "0")}</span><i /></div><div className="product-content"><p>{product.category} / {product.status}</p><h3>{product.maker}<br /><em>{product.model}</em></h3><div><span>{product.focus}</span><button onClick={() => navigate("guides")} aria-label={`Read buying guides for ${product.category}`}>↗</button></div>{offer && <AffiliateOffer offer={offer} />}</div></article>; })}</div>{category === "YouTube" && products.length === 0 && <div className="youtube-empty"><span>▶</span><div><p>FEATURED ON YOUTUBE</p><h3>Reviews will appear here when they go live.</h3><small>We add products to this filter only after their YouTube review has been published.</small></div></div>}</section><section className="method-section" id="about"><div className="method-copy"><p className="eyebrow"><span /> THE GEAR GURU STANDARD</p><h2>Less hype.<br /><em>More signal.</em></h2><p>We are building an independent editorial system for premium outdoor gear. Every future affiliate placement will be visibly disclosed, separate from the verdict, and supported by a current-source check before it goes live.</p><button className="button button-outline" onClick={() => navigate("policy/editorial-policy")}>Read our editorial policy <span>↗</span></button></div><div className="method-list">{[["01", "Context first", "Who is this gear for—and who should skip it?"], ["02", "Claim audit", "What is demonstrated, what is stated, and what still needs testing?"], ["03", "System cost", "We account for accessories, subscriptions, power, service, and learning curve."], ["04", "Plain disclosure", "Affiliate relationships never change the evaluation framework."]].map(([num, title, text]) => <div className="method-item" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section><section className="origin-section"><div className="origin-number">OUT<br />THERE</div><div className="origin-copy"><p className="eyebrow dark"><span /> WHY THIS EXISTS</p><h2>The woods are not<br />something to outgrow.</h2><p><strong>Gear Guru Guide began with a simple belief: a life outdoors does not have an expiration date.</strong> I am an avid wilderness lover, and I created this project for friends who feel the same pull toward wild places—and who want to keep answering it as technology evolves.</p><p>From navigation and off-grid power to powered mobility systems, we examine tools that may make an outing safer, more capable, or more sustainable. Not to replace the wild, but to help more people stay connected to it on their own terms.</p></div><aside className="trust-card"><p>OUR PROMISE</p><h3>Technology should extend the experience—not become the point of it.</h3><div><span>✓</span> Editorial verdicts stay separate from commercial relationships.</div><div><span>✓</span> No gear is presented as medical treatment or a substitute for judgment.</div><div><span>✓</span> Specs, prices, and availability are checked before they are published.</div></aside></section><section className="signal-section" id="signal"><div><p className="eyebrow"><span /> THE SIGNAL</p><h2>One useful field brief.<br />No algorithmic fog.</h2></div><form onSubmit={handleSubscribe} noValidate><label htmlFor="email">GET THE LAUNCH BRIEF</label><div className="input-row"><input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="your@email.com" aria-describedby="subscription-notice" /><button type="submit">Join <span>↗</span></button></div><p id="subscription-notice" className="form-notice" role="status">{notice || "Send a signup request for future field briefs."}</p></form></section></div></main><Footer navigate={navigate} /></>;
}

export default function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  useEffect(() => { const syncRoute = () => setRoute(currentRoute()); window.addEventListener("popstate", syncRoute); return () => window.removeEventListener("popstate", syncRoute); }, []);
  const navigate = (nextRoute: Route) => { const nextPath = routePath(nextRoute); if (window.location.pathname !== nextPath) window.history.pushState({}, "", nextPath); setRoute(nextRoute); window.scrollTo(0, 0); };

  let page = <Home navigate={navigate} />;
  if (route === "guides") page = <GuidesHub navigate={navigate} />;
  else if (route === "blog") page = <><Header navigate={navigate} /><BlogHub navigate={navigate} /><Footer navigate={navigate} /></>;
  else if (route === "brands") page = <><Header navigate={navigate} /><BrandDirectory navigate={navigate} /><Footer navigate={navigate} /></>;
  else if (route === "work-with-us") page = <><Header navigate={navigate} /><WorkWithUs navigate={navigate} /><Footer navigate={navigate} /></>;
  else if (route === "owner-dashboard") page = <OwnerDashboard navigate={() => navigate("home")} />;
  else if (route.startsWith("guide/")) { const guide = guides.find((entry) => route === `guide/${entry.slug}`); page = guide ? <GuidePage guide={guide} navigate={navigate} /> : <GuidesHub navigate={navigate} />; }
  else if (route.startsWith("blog/")) { const post = blogPosts.find((entry) => route === `blog/${entry.slug}`); page = post ? <><Header navigate={navigate} /><BlogPostPage post={post} navigate={navigate} /><Footer navigate={navigate} /></> : <><Header navigate={navigate} /><BlogHub navigate={navigate} /><Footer navigate={navigate} /></>; }
  else if (route.startsWith("policy/")) { const policy = policies.find((entry) => route === `policy/${entry.slug}`); page = policy ? <PolicyPage policy={policy} navigate={navigate} /> : <Home navigate={navigate} />; }

  return <><PageMetadata route={route} />{page}</>;
}
