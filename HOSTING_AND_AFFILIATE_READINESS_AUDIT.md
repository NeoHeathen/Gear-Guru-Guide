# Hosting and Affiliate Readiness Audit

**Reviewed:** August 22, 2026

## Current domain state

`https://gearguruguide.com` currently resolves to Hostinger’s parked-domain page. The Gear Guru Guide application is operating in the managed project environment and has not yet been connected to the custom domain.

Hostinger supports retaining Hostinger nameservers while pointing a domain to an external hosting provider through the required DNS records. The project should be published first, then the exact root-domain and `www` records shown in the project’s Domains settings should be added or updated in Hostinger hPanel. Existing website records must be reviewed carefully so any email-related MX, SPF, DKIM, and DMARC records are preserved.

## Affiliate safeguards already implemented

- A dedicated affiliate-disclosure page and editorial-policy page are publicly reachable in the footer.
- The public catalog deliberately contains no Amazon prices, ratings, review counts, Amazon product imagery, or live affiliate links.
- The private owner dashboard keeps affiliate destinations server-side, outside of public catalog responses.
- Amazon affiliate activation is gated on an approved Associates account and tracking ID.
- The intended required Amazon Associate statement is present in the affiliate disclosure page, and the project’s activation checklist calls for a near-link disclosure whenever monetized recommendations are activated.
- Editorial content separates manufacturer statements, independent reporting, and first-hand use; it avoids medical claims for powered mobility products.

## Remaining actions before monetization

1. Publish the application and connect the Hostinger-managed domain. Confirm both `gearguruguide.com` and `www.gearguruguide.com` resolve over HTTPS.
2. Activate a monitored public mailbox such as `hello@gearguruguide.com`, then apply to Amazon Associates with the live public domain and relevant social channels identified.
3. Before saving any live Amazon Special Link, place a clear near-link disclosure on the monetized page/card in addition to displaying the required site-wide Amazon Associate statement. Update the disclosure to remove any preview-only language.
4. Add a real consent-aware email provider before collecting newsletter subscribers. Update the Privacy page to name the provider, state the purpose and lawful/consent basis where applicable, describe unsubscribe handling, and link to the provider’s privacy policy.
5. Add disclosure scripts and review checklists for every YouTube, Instagram, sponsorship, gifted-product, ambassador, and affiliate recommendation. A disclosure needs to appear in the recommendation itself—not only on an About, profile, footer, or policy page.
6. Recheck the Amazon operating agreement and every direct/network affiliate program’s current terms before activating its links. This audit is a readiness review, not legal advice or a guarantee of program acceptance.

## Sources

1. Amazon Associates Program Operating Agreement — https://affiliate-program.amazon.com/help/operating/agreement
2. Amazon Associates Program Policies — https://affiliate-program.amazon.com/help/operating/policies
3. Amazon Associates disclosure help — https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98
4. FTC, *Endorsement Guides: What People Are Asking* — https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
5. FTC, *Disclosures 101 for Social Media Influencers* — https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers
6. Hostinger, *How to point a domain to external services* — https://www.hostinger.com/support/4737652-how-to-point-a-domain-to-external-services-at-hostinger/
