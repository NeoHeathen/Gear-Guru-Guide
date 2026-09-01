# Hostinger + Amazon Associates Launch Checklist

**Use this checklist after Gear Guru Guide is published. Keep the existing Hostinger nameservers (`ns1.dns-parking.com` and `ns2.dns-parking.com`) in place.** Hostinger can point a domain to an external application through DNS records while retaining Hostinger nameserver and email management.[1]

## 1. Publish and attach the custom domain

1. Create or use the latest project checkpoint, then select **Publish** in the project controls.
2. Open **Settings → Domains**, add `gearguruguide.com`, and copy the exact DNS instructions shown there. The values are deployment-specific; do not substitute a generic IP address or CNAME value.
3. In Hostinger hPanel, open **Domains → gearguruguide.com → DNS / Nameservers → DNS records**. Export the DNS zone first as a backup.
4. Update only the conflicting root-domain and `www` website records with the exact project values. Do **not** change the nameservers. Preserve MX, SPF, DKIM, DMARC, and any other working email records.
5. Allow DNS propagation, then verify that both `https://gearguruguide.com` and `https://www.gearguruguide.com` resolve over HTTPS. Select one canonical host in the Domains settings and redirect the other to it.

## 2. Complete pre-application website checks

- Confirm that the public homepage, original guides, Brand Directory, editorial policy, affiliate disclosure, privacy, terms, and contact pages all load from the custom domain.
- Create and monitor a public mailbox such as `hello@gearguruguide.com`. Use it on the Contact page and in the Amazon Associates application.
- Verify `https://gearguruguide.com/robots.txt` and `https://gearguruguide.com/sitemap.xml`. The owner dashboard is intentionally excluded from indexing.
- Submit the custom-domain sitemap to Google Search Console after ownership verification.
- Do not activate the newsletter form until a real email provider is connected and the Privacy policy identifies that provider and its data handling.

## 3. Activate Amazon only after approval

1. Apply using the live custom domain and identify every relevant Site or social channel accurately. Amazon requires original publicly available content and evaluates site suitability.[2]
2. After acceptance, use a tracking ID for the correct marketplace. Save only Amazon-generated direct Special Links or approved `amzn.to` links in the private owner dashboard.
3. For direct Amazon URLs, keep the approved `tag` parameter. The dashboard now rejects untagged direct Amazon URLs and destinations that are not Amazon domains or approved `amzn.to` links.
4. Before a link is publicly displayed, put a plain-language disclosure directly beside or above the recommendation, for example: **“Disclosure: this is an affiliate link; Gear Guru Guide may earn a commission at no extra cost to you.”** The site must also clearly show: **“As an Amazon Associate I earn from qualifying purchases.”**[3]
5. Do not manually publish Amazon prices, star ratings, review counts, availability, or product images. Use approved current Amazon product content only when your account and tooling permit it.[2]
6. Do not cloak or hide the source URL, auto-redirect visitors to Amazon, frame Amazon, use offline/email/PDF Special Links, or use Amazon marks outside the program’s express permissions.[4]

## 4. Ongoing operating routine

| Cadence | Owner action |
| --- | --- |
| Before each new affiliate placement | Recheck the page’s recommendation, disclosure proximity, merchant approval, and source date. |
| Monthly | Test every live Special Link, confirm the tracking tag/short link still resolves correctly, and update the private dashboard check date. |
| When a video or social post goes live | Add a clear material-connection disclosure in the actual post/video as well as its description; do not rely on a profile or policy page alone.[5] |
| When policy, provider, or product status changes | Update the relevant public policy page and guide date before publishing. |

## Sources

[1] [Hostinger — How to point a domain to external services](https://www.hostinger.com/support/4737652-how-to-point-a-domain-to-external-services-at-hostinger/)

[2] [Amazon Associates — Participation Requirements](https://affiliate-program.amazon.com/help/operating/participation/)

[3] [Amazon Associates — Identifying yourself as an Associate](https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98)

[4] [Amazon Associates — Participation Requirements, Special Link restrictions](https://affiliate-program.amazon.com/help/operating/participation/)

[5] [FTC — Disclosures 101 for Social Media Influencers](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers)
