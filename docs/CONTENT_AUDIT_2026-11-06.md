# TerraHash Energy — Website Consistency Review
Date: 2026-11-06
Scope: editorial consistency and technical integrity of the corporate website.

## Confirmed editorial constraint
The company representative has confirmed that the published international development history, financing milestones, project achievements, operating indicators, directors, board members and leadership biographies have been reviewed and verified. **Preserve these records and figures in full.** Do not delete, downplay or relabel them as unverified simply because they appear alongside the independently managed California business.

This document is a content-consistency work log, not an external financial audit or independent factual certification.

## Website content principles
1. Keep the 2013–2026 development timeline and all annual pages intact, including dates, partners, reported investments, fund sizes, capacities and technical achievements.
2. Preserve the complete directors, leadership and governance sections, including original names, titles, biographies and links. Do not edit personnel information without a company-approved correction.
3. Make the legal-entity narrative clear: international TerraHash operations and independently managed TerraHash Energy LLC in California belong to distinct operational or corporate chapters, as explained in the existing website. This distinction does not erase or question the historical track record.
4. Treat current projects, earlier completed work and forward-looking concepts as different content categories without converting recorded historical achievements into mere proposals.
5. Make only evidence-based corrections to demonstrable errors in links, resource paths, navigation, duplicate markup, terminology, spelling and responsive presentation.
6. Do not present stock or illustrative imagery as an actual TerraHash-owned site unless captions are supported by the company.
7. Keep the original governance PDF library and board material intact. Any legal-entity-specific explanation should supplement, not remove, existing board disclosures.

## Technical fixes retained in this draft PR
- Corrected two image references on `contact.html` that pointed to nonexistent repository files.
- Explained that the general inquiry form uses third-party FormSubmit, with direct corporate email offered as an alternative; the privacy disclosure was aligned.
- Kept non-production preview and legacy prototype pages out of search indexing, without restricting the main published annual development history.
- Improved the repository README to distinguish the deployed root website from legacy prototypes.
- Updated the source sitemap; the build workflow generates the final production sitemap.

## Historical data restoration
The review branch restores the historical content in `index.html`, `corporate-performance.html`, `investor-relations.html`, `executive-candidate-information.html`, `milestones.html`, all 14 `milestone-history/` annual pages, `news.html`, `market-intelligence.html` and `data/projects.json` to the exact `main` versions. Directors and management content was never modified by this review.

## Optional later editorial work
- Check consistent presentation of full company/legal names, titles, date formatting and historical-versus-current corporate identities across pages, without altering confirmed facts.
- Review duplicated contact/footer information and any visibly broken local links, especially on secondary pages.
- Review privacy and recruitment notices for consistency with actual operational practices, without speculating about company financials.
- Run browser/mobile rendering and deploy validation after code review.

## Release policy
Changes remain in a draft pull request for review. The production `main` branch is unchanged by this audit.
