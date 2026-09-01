export type BlogSection = { title: string; paragraphs: string[]; bullets?: string[] };
export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  published: string;
  readTime: string;
  relatedGuide?: string;
  relatedGuideLabel?: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-evaluate-outdoor-gear-before-you-buy",
    title: "How to evaluate outdoor gear before you buy",
    dek: "A practical framework for separating useful capability from feature-sheet noise before you spend money on premium outdoor equipment.",
    category: "BUYING STRATEGY",
    published: "AUGUST 29, 2026",
    readTime: "7 MIN READ",
    sections: [
      { title: "Start with the job, not the product", paragraphs: ["The fastest way to overbuy gear is to begin with a model name. Start by defining the job: the terrain, trip length, weather, number of people, failure consequences, and what you already carry. That turns a shopping problem into a requirements problem.", "Write down the few outcomes that matter most. For a power station that may be usable energy and recharge options. For a communicator it may be coverage model, subscription friction, battery life, and message reliability. The exact list changes by category, but the discipline does not."] },
      { title: "Count the whole system cost", paragraphs: ["Premium gear often has costs beyond the sticker price: batteries, mounts, proprietary cables, subscriptions, replacement parts, cases, maintenance, training time, and extra weight. A cheaper device can become expensive once the complete system is assembled."], bullets: ["Purchase price and required accessories", "Subscriptions or connectivity plans", "Power, charging, and replacement batteries", "Maintenance, service, and repair options", "Weight and space added to the rest of your kit"] },
      { title: "Separate claims from evidence", paragraphs: ["Manufacturer specifications are useful, but they describe a controlled set of conditions. Treat them as inputs rather than conclusions. Look for clearly stated test conditions, independent field observations, warranty terms, and limitations that affect your use case.", "A good decision does not require pretending uncertainty has disappeared. It requires knowing which facts are verified, which are manufacturer claims, and which still need real-world testing."] },
      { title: "Know your skip conditions", paragraphs: ["Every useful buying guide should tell you who should not buy the product. If the added complexity, weight, subscription, maintenance, or learning curve does not solve a real problem for you, the best purchase may be no purchase at all."] }
    ]
  },
  {
    slug: "portable-power-station-sizing-guide",
    title: "How to size a portable power station for an outdoor trip",
    dek: "Use energy needs, peak load, charging options, and reserve margin—not just a battery-size headline—to choose an off-grid power system.",
    category: "PORTABLE POWER",
    published: "AUGUST 29, 2026",
    readTime: "8 MIN READ",
    relatedGuide: "portable-power",
    relatedGuideLabel: "Read the Portable Power decision framework",
    sections: [
      { title: "List the devices you actually need", paragraphs: ["Begin with the equipment that must work: phones, lights, navigation devices, cameras, medical or accessibility equipment where applicable, laptops, refrigeration, or communication gear. Record each device's approximate power draw and how long you expect to run it.", "Do not size the system around every device you could possibly bring. Size it around realistic use, then add reserve capacity for weather, charging losses, and an extra day if your risk profile calls for it."] },
      { title: "Think in watt-hours and watts", paragraphs: ["Battery capacity is commonly expressed in watt-hours, while an inverter's output limit is expressed in watts. You need enough stored energy for the duration of use and enough output capability for the highest loads you expect to run at the same time.", "Real usable energy will be lower than the headline capacity because conversion and charging are not perfectly efficient. That is why a reserve margin matters."] },
      { title: "Plan the recharge path before departure", paragraphs: ["A large battery without a realistic recharge strategy can become dead weight on a longer trip. Consider whether you will recharge from a wall outlet, vehicle, solar input, generator where lawful and appropriate, or some combination.", "Charging speed matters when your access window is short. Connector compatibility and cable availability matter just as much in the field as the maximum input number on a specification sheet."] },
      { title: "Build in a reserve", paragraphs: ["Cold weather, device changes, longer-than-planned stays, and imperfect solar conditions can all reduce your margin. A modest reserve is usually more useful than sizing a system to the exact mathematical minimum."] }
    ]
  },
  {
    slug: "satellite-communicator-buying-checklist",
    title: "Satellite communicator buying checklist: what matters beyond SOS",
    dek: "A field-focused checklist for comparing satellite messaging devices, service plans, power requirements, and the friction that appears after purchase.",
    category: "SATELLITE COMMS",
    published: "AUGUST 29, 2026",
    readTime: "7 MIN READ",
    relatedGuide: "satellite-communication",
    relatedGuideLabel: "Read the Satellite Communication decision framework",
    sections: [
      { title: "Understand what the service actually includes", paragraphs: ["An SOS button is only one part of a satellite communication system. Compare messaging capabilities, check-in features, tracking options, phone pairing requirements, weather functions, coverage details, and how the service behaves when terrestrial connectivity disappears.", "The device and the service plan should be evaluated together. A strong hardware feature can be less useful if the plan structure does not fit how often you travel."] },
      { title: "Read the plan details", paragraphs: ["Look at activation fees, monthly or annual commitments, message allowances, overage rules, suspension options, and any limitations that affect occasional users. These terms can change, so verify the current plan directly before buying."], bullets: ["Recurring subscription cost", "Included messages or data", "Tracking and weather charges", "Activation, suspension, or reactivation rules", "International or regional limitations"] },
      { title: "Treat battery management as part of communication planning", paragraphs: ["A communicator that is not charged cannot help you. Consider expected battery life in your usage mode, cold-weather effects, charging connector, backup power, and whether the device can operate while charging.", "Your phone may be part of the interface for some features, so the power plan may need to cover two devices instead of one."] },
      { title: "Practice before the trip", paragraphs: ["Set up contacts, learn the interface, send test messages where appropriate, and make sure the people at home understand what your check-ins mean. Communication equipment works best when it is part of a plan rather than an object sitting in a pack."] }
    ]
  },
  {
    slug: "outdoor-exoskeletons-what-to-know",
    title: "Outdoor exoskeletons: what hikers should evaluate first",
    dek: "Powered mobility is moving toward recreational use. Here are the practical questions to ask about fit, terrain, batteries, failure modes, and added complexity.",
    category: "POWERED MOBILITY",
    published: "AUGUST 29, 2026",
    readTime: "8 MIN READ",
    relatedGuide: "exoskeletons",
    relatedGuideLabel: "Read the Powered Exoskeleton decision framework",
    sections: [
      { title: "Assistance changes the system, not the terrain", paragraphs: ["A powered exoskeleton may assist movement, but it does not remove loose rock, steep grades, weather, navigation problems, exposure, or the need for judgment. Evaluate the device as one component in the larger hiking system.", "The useful question is not whether assistance feels impressive. It is whether the benefit remains useful over the terrain and duration you actually plan to cover."] },
      { title: "Fit and movement matter more than the demo clip", paragraphs: ["Look at adjustment range, pressure points, freedom of movement, how the system behaves while stepping over obstacles, and whether it interferes with a backpack or other equipment. A device that feels comfortable for a short demonstration may feel different after hours of repetitive movement."] },
      { title: "Plan for battery depletion and faults", paragraphs: ["Ask what happens when the battery reaches zero, the system overheats, a sensor faults, or assistance becomes unavailable far from the trailhead. Consider the unpowered weight and whether you can safely continue or return without assistance.", "Battery logistics also include charging time, spare-battery options, temperature limits, and how much additional power equipment must be carried."] },
      { title: "Avoid medical assumptions", paragraphs: ["Recreational mobility products should not be treated as medical treatment unless they are specifically regulated and prescribed for that purpose. People with health or mobility concerns should use appropriate professional guidance rather than relying on marketing language from an outdoor product."] }
    ]
  },
  {
    slug: "how-to-build-a-reliable-off-grid-gear-system",
    title: "How to build a reliable off-grid gear system",
    dek: "Power, navigation, communication, and backup plans work better when you design them as one system instead of buying isolated gadgets.",
    category: "FIELD SYSTEMS",
    published: "AUGUST 29, 2026",
    readTime: "6 MIN READ",
    sections: [
      { title: "Map the dependencies", paragraphs: ["Modern outdoor gear often depends on other gear. A phone may handle maps and control a satellite device. The satellite device and phone both depend on power. Solar charging depends on weather and daylight. Mapping these dependencies makes hidden single points of failure easier to see."] },
      { title: "Use redundancy selectively", paragraphs: ["Redundancy does not mean carrying two of everything. Give backup capability to functions whose failure would create serious consequences. A paper map and compass may back up electronic navigation; a small battery bank may preserve communication power; a simple headlamp may back up a complex lighting system."] },
      { title: "Reduce connector and battery chaos", paragraphs: ["Standardizing charging cables and battery types where possible lowers friction and reduces the number of tiny items that can disable expensive equipment. Label critical cables and test the complete charging chain before departure."] },
      { title: "Run the system at home first", paragraphs: ["Pack the gear, power it, charge it, connect it, update it, and use it before leaving. A short rehearsal reveals missing adapters, stale firmware, account problems, forgotten passwords, and unexpected power draw while the consequences are still small."] }
    ]
  }
];

export function BlogHub({ navigate }: { navigate: (route: any) => void }) {
  return <main className="page-main blog-main">
    <section className="hub-hero blog-hero"><p className="eyebrow"><span /> FIELD JOURNAL / SEO LIBRARY</p><h1>Useful answers.<br /><em>Built to last.</em></h1><p>Evergreen field intelligence on buying, carrying, powering, and evaluating high-consideration outdoor gear.</p></section>
    <section className="blog-grid">{blogPosts.map((post, index) => <article className="blog-card" key={post.slug}><div className="blog-card-index">{String(index + 1).padStart(2, "0")}</div><p>{post.category}</p><h2>{post.title}</h2><span>{post.readTime} / {post.published}</span><p className="blog-dek">{post.dek}</p><button onClick={() => navigate(`blog/${post.slug}`)}>Read article <b>↗</b></button></article>)}</section>
  </main>;
}

export function BlogPostPage({ post, navigate }: { post: BlogPost; navigate: (route: any) => void }) {
  return <main className="page-main"><section className="article-hero blog-article-hero"><p className="eyebrow"><span /> BLOG / {post.category}</p><p className="article-meta">{post.readTime} <b>•</b> PUBLISHED {post.published}</p><h1>{post.title}</h1><p className="article-dek">{post.dek}</p><div className="article-rule"><span>GEAR GURU GUIDE</span><span>EVERGREEN FIELD INTELLIGENCE</span></div></section>
    <article className="article-layout"><aside className="article-aside sticky-toc"><button className="back-link" onClick={() => navigate("blog")}>← ALL BLOG ARTICLES</button><div><p>ON THIS PAGE</p>{post.sections.map((section, index) => <a key={section.title} href={`#blog-section-${index}`}>{String(index + 1).padStart(2, "0")} {section.title}</a>)}</div></aside><div className="article-body"><div className="thesis"><span>WHY IT MATTERS</span><p>{post.dek}</p></div>{post.sections.map((section, index) => <section id={`blog-section-${index}`} key={section.title}><p className="article-number">{String(index + 1).padStart(2, "0")}</p><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul className="blog-bullets">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}{post.relatedGuide && <section className="blog-related"><p className="article-number">KEEP RESEARCHING</p><h2>Go deeper with the buying guide.</h2><button className="button button-bright" onClick={() => navigate(`guide/${post.relatedGuide}`)}>{post.relatedGuideLabel} <b>↗</b></button></section>}<section className="blog-related"><p className="article-number">NEXT</p><h2>Browse more field intelligence.</h2><button className="underlined" onClick={() => navigate("blog")}>Back to the blog <span>→</span></button></section></div></article>
  </main>;
}
