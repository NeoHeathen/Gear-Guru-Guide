# Gear Guru Guide: Go-Live and Amazon Associates Roadmap

## The Short Answer

**Publish the website first, but do not rush the Amazon Associates application with only the current homepage.** The current site is an excellent launch foundation, yet Amazon’s own review guidance says website applications should have robust, original content—its rule of thumb is at least **10 posts**—and that website content should generally be recent, within the past 60 days.[1] Publish the site now as a **soft launch**, build out 10 original buying guides or field notes, then apply using `gearguruguide.com` as the primary site.

> Amazon does not pre-approve a website before sales. After enrollment, it reviews the application once the account has generated at least three qualifying sales in the first 180 days. Personal orders do not count.[1]

## Launch Order

| Step | What to do | Why it comes now |
|---|---|---|
| **1. Publish the current version** | In the project interface, click **Publish**. This makes the saved website available publicly. | The public site establishes the brand and provides the foundation for original content. |
| **2. Connect `gearguruguide.com`** | After publication, open **Settings → Domains**, add the domain, and copy the exact DNS record shown there into Hostinger’s DNS zone. Keep the current Hostinger nameservers unless the domain screen specifically tells you otherwise. | The domain panel produces the destination record for this specific deployment; do not guess or reuse a generic record. |
| **3. Add the application pages** | Publish Privacy, Terms, Affiliate Disclosure, Editorial Policy, Contact, and About pages. Add the required Amazon Associate statement only once actual Amazon links appear. | These pages make the brand transparent and help visitors understand how recommendations are made. |
| **4. Publish 10 original posts** | Publish the first ten research-backed pieces listed below. Each should have a distinct point of view, sources, author/byline, date, and “who should skip this” section. | Amazon says robust original content is expected; it suggests at least 10 posts as a practical benchmark.[1] |
| **5. Apply to Amazon Associates** | Apply through Associates Central using the live website URL and any live public social profiles you actually operate. Add only the exact social-page URLs, not generic platform URLs. | Amazon reviews the websites and social profiles you declare.[1] |
| **6. Use tagged links, then earn the first three qualifying sales** | Use Amazon’s link tools to create your own Special Links. Do not purchase through them yourself. | The application review begins after three qualifying sales within 180 days.[1] |
| **7. Activate live product data later** | Once eligible, register for Creators API, generate credentials, and connect the approved integration. | Amazon’s current API documentation requires Associates enrollment and at least 10 qualifying sales in the past 30 days for PA API access through Creators API.[3] |

## The First 10 Original Posts

These are **editorial briefs**, not fabricated reviews. Use manufacturer documentation, independent testing, and clearly labeled observations. Do not state that you personally tested a product unless you actually did.

| # | Working title | Existing catalog connection | Original angle |
|---|---|---|---|
| 1 | **Why the Woods Are Not Something to Outgrow** | Brand foundation | Founder story and the editorial standard for technology in the outdoors. |
| 2 | **Outdoor Exoskeletons: A Buyer’s Framework Before You Spend Four Figures** | Hypershell, Dnsys | Fit, battery, terrain, gait, limitations, safety, and non-medical boundaries. |
| 3 | **Satellite Communication Is a Layer, Not a Plan** | Garmin GPSMAP / inReach | Explain communication planning without implying rescue guarantees. |
| 4 | **Portable Power Is a System, Not a Battery** | EcoFlow, Goal Zero, Jackery, DJI | Capacity, input, weight, cables, storage, and support—without stale runtime or price claims. |
| 5 | **The Real Ownership Cost of High-Dollar Outdoor Gear** | All categories | Accessories, subscriptions, charging, repair, service, and learning curve. |
| 6 | **How to Choose an Expedition Shelter by Conditions, Not Hype** | NEMO, MSR, Hilleberg | Weather, group size, site selection, carry system, and constraints. |
| 7 | **What a Satellite Messenger Cannot Do for You** | Garmin category | Safety-first companion article that builds reader trust. |
| 8 | **Camera Gear for the Trip You Will Actually Take** | DJI, Insta360, GoPro | Weather, batteries, workflow, carry weight, and skill level. |
| 9 | **A Field Guide to High-Comfort Basecamp Gear** | YETI, Helinox | When camp comfort genuinely improves a trip and when it becomes excess carry. |
| 10 | **The Gear Guru Guide Evaluation Method** | Brand foundation | Publish the exact framework used to classify claims, evidence, system cost, and “skip if” cases. |

## Getting Product Information for the Existing 20 Products

### Phase A: Before Amazon Approval

Build each product card and guide from **source-attributed editorial research**. Your safe, useful fields are product brand, model, category, intended use, manufacturer page URL, original editorial notes, source links, publication date, and the research status. The current website already uses this approach: it has a 20-item editorial watchlist and deliberately does not show volatile price, stock, star-rating, or review-count data.

Do **not** manually copy Amazon price, rating, review count, images, or availability into the site. Those fields change frequently and Amazon’s program content rules apply once they are used commercially. Instead, use primary manufacturer specifications plus independent publications for your original content. Keep a simple source record for each product so every guide can say what is manufacturer-stated, independently observed, and still unverified.

| Field to collect now | Recommended source | Safe to publish before Associates approval? |
|---|---|---|
| Brand and model | Manufacturer product page | Yes |
| Use case and feature specifications | Manufacturer manual/product page, with attribution | Yes, if current and accurately quoted or summarized |
| Editorial decision factors | Your original analysis, independent test sources | Yes |
| Manufacturer page link | Official brand site | Yes |
| Current Amazon price / availability | Do not collect for the launch site | No—not as a manually maintained commerce claim |
| Amazon star rating / review count / customer review excerpts | Do not collect for the launch site | No |
| Amazon product image | Do not copy manually | Do not use until the approved content workflow supports it |

### Phase B: After Associates Enrollment

After you enroll, create **Special Links** using Amazon’s provided linking tools and your assigned tracking ID. The links must contain that ID. Amazon’s review guidance specifically calls out the need for tagged links on sites you list in your application.[1] The site should show a clear link-level disclosure near any monetized recommendation and, once Amazon links are active, the required sitewide language: **“As an Amazon Associate I earn from qualifying purchases.”**[2]

The practical setup is a transparent, editorial product page with: your original guide, a visible disclosure above the recommendation block, a current “Check current price on Amazon” Special Link, the date your editorial research was last checked, and a “skip if” decision note. Avoid treating Amazon as the source of the review; your own guide is the product.

### Phase C: After Creators API Eligibility

For automatic catalog retrieval, the current route is Amazon’s **Creators API**. It supports `SearchItems`, `GetItems`, `GetVariations`, and `GetBrowseNodes`. Amazon lists these prerequisites: current Associates enrollment in the target marketplace, at least 10 qualifying sales in the last 30 days for PA API access through Creators API, API registration in Associates Central, and generated credentials.[3]

At that point, provide the API credentials and Associates tracking ID securely. The website can then be extended to retrieve approved, current product information instead of manually maintaining volatile data. **No additional connector is required for the initial site.** The inactive Amazon-related research connector currently available is not a substitute for Amazon Associates product-data credentials.

## Disclosure Copy to Add When Amazon Links Are Active

Place this immediately above the first Amazon link or comparison block:

> **Disclosure:** This guide may contain affiliate links. If you purchase through a qualifying link, Gear Guru Guide may earn a commission at no additional cost to you. Our evaluation framework remains the same whether or not a product earns a commission.

Add this conspicuously in the sitewide footer or disclosure page exactly as Amazon requires:

> **As an Amazon Associate I earn from qualifying purchases.**

Amazon requires both a legally compliant disclosure near affiliate links and clear identification as an Associate on the site.[2]

## What You Need to Do Next

1. Preview the website one more time, then click **Publish** in the project interface.
2. Connect `gearguruguide.com` through **Settings → Domains** using the record the domain panel provides.
3. Tell me whether you want the first 10 posts built as articles, category pages, or a mix. I can create the first three original drafts and add the required disclosure and policy pages before you apply.

## References

[1] [Amazon Associates Central, “Application Review Process”](https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM)

[2] [Amazon Associates Central, “Why do I have to identify myself as an Associate?”](https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98)

[3] [Amazon Associates Central, “Creators API: Introduction”](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction)
