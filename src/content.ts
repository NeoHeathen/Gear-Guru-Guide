export type Guide = {
  slug: "exoskeletons" | "portable-power" | "satellite-communication";
  kicker: string;
  title: string;
  dek: string;
  readTime: string;
  updated: string;
  thesis: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
  checklistTitle: string;
  checklist: string[];
  skipIf: string;
  relatedProductIds: number[];
  videoReview: { plannedTitle: string; description: string; youtubeId?: string };
  sources: Array<{ label: string; url: string }>;
};

export const guides: Guide[] = [
  {
    slug: "exoskeletons",
    kicker: "BUYING GUIDE / POWERED MOBILITY",
    title: "Outdoor exoskeletons: a decision framework before you spend four figures.",
    dek: "Powered hiking assist is now a consumer category. The useful question is not whether it looks futuristic—it is whether the whole system earns a place on your actual trail.",
    readTime: "8 MIN READ",
    updated: "AUGUST 2026",
    thesis: "Consumer outdoor exoskeletons may assist movement, but they are not medical devices and they do not replace conditioning, training, route choices, or judgment.",
    sections: [
      {
        title: "Start with the trip, not the device.",
        paragraphs: [
          "The clearest reason to look at powered hiking assist is not novelty. It is a specific friction point in a known trip: a long approach with camera gear, repeated elevation days, a controlled recovery from demanding efforts, or a desire to keep a familiar route within reach. That answer should be concrete before a product page ever enters the picture.",
          "Define your terrain, carrying load, expected pace, duration, and exit options. A device that feels interesting on a maintained daytime trail may create a completely different set of questions on loose rock, wet roots, snow, narrow traverses, or trips where charging is difficult. The system must fit the whole trip, not only the uphill highlight reel."
        ]
      },
      {
        title: "Treat manufacturer claims and field observations as different evidence.",
        paragraphs: [
          "Outdoor brands describe powered mobility products in terms of assistance, endurance, adaptive movement, and battery range. Those specifications are useful starting points, but they are not a complete verdict. Independent field testing of early consumer models has noted useful movement sensing alongside altered gait, comfort tradeoffs, and an adjustment period after switching the assistance off.",
          "That does not make the category good or bad. It makes fit, acclimation, terrain, and personal use case decisive. Gear Guru Guide will label manufacturer-stated specifications, independent observations, and first-hand field impressions separately so readers can see what each conclusion rests on."
        ]
      },
      {
        title: "Count the full carry system.",
        paragraphs: [
          "The purchase is not just the frame that sits around the hips and legs. It includes battery strategy, charging time, spare-power logistics, weather tolerance, storage, fit adjustment, firmware/app requirements, service process, warranty terms, and whether the product changes the rest of your carry. A high-dollar item earns its place when it reduces friction across that whole system—not when it only looks compelling in isolation.",
          "Ask how you would proceed if the assist is unavailable mid-trip. The answer should leave you with a sensible hike, not a plan that depends on a machine behaving perfectly. This is a practical planning question, not a fear-based one."
        ]
      }
    ],
    checklistTitle: "The pre-purchase field check",
    checklist: ["Name the actual route, grade, surface, weather range, and carrying load.", "Try the fit and movement pattern in a controlled environment before relying on it outdoors.", "Plan charging, backup power, storage, and a conservative no-assist exit option.", "Read current manufacturer warnings, warranty, return, and support terms."],
    skipIf: "Skip this category for now if your main goal is to solve pain, balance, or mobility concerns without medical guidance; if the trip still makes sense only with powered assist; or if the device adds more charging and fit complexity than your outings can comfortably absorb.",
    relatedProductIds: [1, 2, 3],
    videoReview: { plannedTitle: "Do outdoor exoskeletons actually belong on the trail?", description: "A field-led review of fit, terrain, battery planning, and the full powered-mobility decision system." },
    sources: [
      { label: "Hypershell Global, outdoor exoskeleton overview", url: "https://hypershell.tech/en-us/" },
      { label: "Outdoor Life, independent comparison of Hypershell Pro X and Dnsys X1 Carbon", url: "https://www.outdoorlife.com/gear/can-an-exoskeleton-for-hiking-help-you-bag-a-peak/" }
    ]
  },
  {
    slug: "portable-power",
    kicker: "BUYING GUIDE / OFF-GRID POWER",
    title: "Portable power is a system, not a battery.",
    dek: "Large-capacity power stations can unlock comfortable, capable basecamps. They can also become a heavy, complicated purchase that never matches the way you travel.",
    readTime: "7 MIN READ",
    updated: "AUGUST 2026",
    thesis: "The right portable power system begins with realistic loads, recharge conditions, transport limits, and a clear plan for the cables and accessories that make it usable.",
    sections: [
      {
        title: "Write down the loads before comparing capacity.",
        paragraphs: [
          "Start with the equipment you actually expect to use: refrigeration, camera batteries, laptop, lighting, CPAP equipment where applicable, induction cooking, tools, or a small remote-work setup. Then identify when those loads run and where the system can recharge. This shifts the purchase from a vague desire for more power into a specific operating plan.",
          "A single large number on a product page does not answer the real question. It does not tell you whether the unit fits your vehicle, whether you can lift it, how long your travel days allow you to recharge, or what happens to the plan when weather changes."
        ]
      },
      {
        title: "Follow the energy path end to end.",
        paragraphs: [
          "A dependable setup has an input side, a storage side, and a distribution side. The input may be vehicle charging, shore power, solar, or a compatible generator; the storage is the power station and any expansion battery; the distribution is the cables, outlets, adapters, and protected devices that let the system do useful work. Every piece should be deliberate.",
          "EcoFlow’s current DELTA Pro 3 product page, for example, describes a portable system designed around expandable capacity and multiple recharge paths. That type of product can be a useful research anchor, but it is not an automatic recommendation. Confirm current specifications and support terms directly with the manufacturer before a purchase."
        ]
      },
      {
        title: "Own the friction, not just the capability.",
        paragraphs: [
          "The better question is often: can I transport, secure, maintain, recharge, and troubleshoot this system on the trips I actually take? Large batteries bring real capability, but they also add weight, heat-management considerations, cable clutter, storage needs, and a higher cost of getting the system wrong.",
          "Build a simple pack-down ritual before your first major trip. Mark cables, carry the needed adapters, protect ports, and know what can stay unplugged. The goal is quiet reliability—not a campsite that feels like a temporary data center."
        ]
      }
    ],
    checklistTitle: "The system-cost check",
    checklist: ["List every device, its expected run time, and how often it will be used.", "Choose your realistic recharge path before choosing a battery size.", "Measure vehicle storage, lifting, tie-down, and weather-protection constraints.", "Price the total system: cables, panels, adapters, expansion, storage, and support."],
    skipIf: "Skip the large-system purchase if you cannot name the loads you need to run, do not have a realistic recharge path, or mostly take trips where a compact power bank and disciplined device use would solve the real problem.",
    relatedProductIds: [11, 12, 13, 15, 19],
    videoReview: { plannedTitle: "The premium power-system test", description: "A complete look at loads, recharge routes, vehicle constraints, and the equipment that turns a battery into a usable system." },
    sources: [{ label: "EcoFlow, DELTA Pro 3 product page", url: "https://us.ecoflow.com/products/delta-pro-3-portable-power-station" }]
  },
  {
    slug: "satellite-communication",
    kicker: "BUYING GUIDE / BACKCOUNTRY COMMUNICATION",
    title: "Satellite communication is a layer, not a plan.",
    dek: "A satellite messenger can be one of the most meaningful pieces of modern backcountry equipment. Its value is highest when it sits inside a communication plan you already understand.",
    readTime: "6 MIN READ",
    updated: "AUGUST 2026",
    thesis: "A satellite communicator can support two-way messaging, location sharing, and emergency communication where cellular service is limited, but it cannot guarantee rescue or replace route planning, weather awareness, training, and early decision-making.",
    sections: [
      {
        title: "The first layer is the plan you leave behind.",
        paragraphs: [
          "Before choosing any device, write a trip plan with route, access point, turnaround time, expected return window, group information, and a trusted person who understands what to do if you miss a check-in. That plan is useful even if every battery fails. It establishes the context that a message device can support.",
          "Set communication expectations before departure: which messages you will send, when you will send them, what a missed check-in means, and which changes justify a message. A communicator is far more useful when its people and procedures are already in place."
        ]
      },
      {
        title: "Match the device to the trip and the workflow.",
        paragraphs: [
          "Garmin’s inReach category includes satellite communicators designed around messaging, location sharing, and SOS features. Depending on the product, that may involve a smartphone pairing workflow and an active subscription. Those details matter because a device that is not charged, activated, understood, or carried accessibly may not serve the purpose you bought it for.",
          "Practice while you still have time and signal. Learn the interface, confirm your contacts, check subscription status, understand the battery behavior, and decide where the unit lives while moving. The correct location is usually the one you can reach quickly without unpacking everything."
        ]
      },
      {
        title: "Avoid the force-field mistake.",
        paragraphs: [
          "Satellite communication can lower the cost of being out of cell range; it does not erase the consequences of poor route, weather, or group decisions. Weather, terrain, canopy, satellite visibility, emergency response conditions, and your ability to communicate clearly all remain part of the situation.",
          "Use the technology as a deliberate layer in a conservative system: route plan, conditions check, appropriate skills, required equipment, informed contact, and communications. The strongest safety technology is useful precisely because it does not pretend to be the only thing that matters."
        ]
      }
    ],
    checklistTitle: "The communication-layer check",
    checklist: ["Leave a complete route and return plan with a trusted contact.", "Confirm subscription, activation, contacts, device charge, and required phone pairing before departure.", "Practice sending the exact types of messages you expect to use.", "Carry the communicator where it is accessible and protect it from the conditions of the trip."],
    skipIf: "Skip the purchase if you expect it to replace trip planning or outdoor skills, will not maintain the required subscription and charging routine, or mostly travel where reliable cellular coverage and a simpler plan serve your needs better.",
    relatedProductIds: [5, 6, 7],
    videoReview: { plannedTitle: "Satellite messengers versus satellite phones: what changes?", description: "A safety-first guide to coverage, subscriptions, field workflow, and why the communication plan comes before the device." },
    sources: [
      { label: "Garmin, inReach satellite communicator category", url: "https://www.garmin.com/en-US/c/outdoor-recreation/satellite-communicators/" },
      { label: "Garmin, inReach Messenger Plus", url: "https://www.garmin.com/en-US/p/1191310/" }
    ]
  }
];

export type Policy = { slug: "affiliate-disclosure" | "editorial-policy" | "privacy" | "terms" | "contact"; title: string; intro: string; sections: Array<{ title: string; paragraphs: string[] }> };

export const policies: Policy[] = [
  { slug: "affiliate-disclosure", title: "Affiliate Disclosure", intro: "Gear Guru Guide is an independent editorial publication. This page explains how commercial relationships are handled.", sections: [
    { title: "Affiliate identification", paragraphs: ["When an affiliate link appears, it is identified near the relevant recommendation. Commercial participation does not determine the editorial verdict or whether a product is included."] },
    { title: "How affiliate links work", paragraphs: ["Some future links may be affiliate links. If you purchase through a qualifying link, Gear Guru Guide may earn a commission at no additional cost to you. Affiliate participation does not change the editorial framework, evidence standard, or ‘skip if’ guidance in an article."] },
    { title: "Amazon Associates notice", paragraphs: ["When Amazon Special Links are active, the site will conspicuously display the required statement: “As an Amazon Associate I earn from qualifying purchases.” Product prices, ratings, availability, and product imagery will not be manually maintained from Amazon pages."] }
  ] },
  { slug: "editorial-policy", title: "Editorial Policy", intro: "Gear Guru Guide exists to help readers make better high-consideration outdoor gear decisions—not to manufacture enthusiasm for every new product.", sections: [
    { title: "Evidence labels", paragraphs: ["We distinguish manufacturer-stated specifications, independent reporting, and first-hand observations. We do not present a product as field-tested by Gear Guru Guide unless it has actually been used and evaluated in that context."] },
    { title: "Commercial independence", paragraphs: ["We do not sell rankings, positive verdicts, or inclusion in an editorial guide. A commercial relationship, gifted product, paid travel, or other material connection will be disclosed where relevant."] },
    { title: "Corrections", paragraphs: ["If a material factual error is identified, we will correct it and update the guide date. Product specifications, terms, prices, and availability can change; readers should confirm current details directly with the manufacturer or retailer before purchasing."] }
  ] },
  { slug: "privacy", title: "Privacy", intro: "This page describes how Gear Guru Guide handles information submitted through the site and its contact channels.", sections: [
    { title: "Email and inquiries", paragraphs: ["The field-brief signup and partnership inquiry controls prepare an email in your own email application. The website itself does not store those form entries. If you send the prepared email, your message and address are handled by the publication’s email provider in the normal course of correspondence."] },
    { title: "Future services", paragraphs: ["If Gear Guru Guide adds a mailing-list provider, analytics platform, account system, or other service that collects additional personal information, this policy will be updated before that collection is enabled."] },
    { title: "Your choices", paragraphs: ["Do not send sensitive personal information unless it is necessary for your request. You may ask for access to or deletion of correspondence information by using the public contact channel listed on the Contact page, subject to applicable recordkeeping obligations."] }
  ] },
  { slug: "terms", title: "Terms of Use", intro: "By using Gear Guru Guide, you agree to use the information responsibly and independently.", sections: [
    { title: "Informational use", paragraphs: ["Gear Guru Guide provides general editorial information about outdoor equipment. It is not medical, legal, rescue, technical, or professional safety advice. Outdoor activities carry inherent risks, and you remain responsible for your plans, equipment, training, conditions, and decisions."] },
    { title: "No performance guarantee", paragraphs: ["We work to make guides accurate and useful, but product information and conditions change. We do not guarantee a product’s suitability, performance, availability, or safety for any particular person, trip, or situation."] },
    { title: "Intellectual property", paragraphs: ["The site’s original writing, design, and brand materials may not be reproduced or commercially reused without permission. Product names and marks belong to their respective owners."] }
  ] },
  { slug: "contact", title: "Contact", intro: "Gear Guru Guide welcomes factual corrections, source suggestions, editorial questions, and professional inquiries.", sections: [
    { title: "Editorial and reader contact", paragraphs: ["For corrections, source suggestions, and general editorial correspondence, email hello@gearguruguide.com."] },
    { title: "Business and sponsorship inquiries", paragraphs: ["Brands and agencies can use the Business & Sponsorship link in the footer or email partners@gearguruguide.com for product-review consideration, sponsorship, ambassador, and partnership inquiries."] },
    { title: "What to include", paragraphs: ["For a correction request, include the page URL, the specific statement, your supporting source, and an explanation of the requested change. For product information, include only publicly shareable materials and identify any commercial relationship."] }
  ] }
];
