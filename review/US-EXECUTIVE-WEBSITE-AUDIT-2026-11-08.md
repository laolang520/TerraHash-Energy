# TerraHash Energy | US Executive Candidate Website Audit & P0 Implementation
Date: 2026-11-08
Repository: laolang520/TerraHash-Energy
Baseline: main
Review branch: review/us-executive-credibility-p0-2026-11-08
Release status: NOT APPROVED. Do not merge into main until factual, legal, recruiting, and visual review is complete.

## Scope & principles
Reviewed HTML content: index.html, about.html, corporate-identity.html, leadership.html, corporate-performance.html, investor-relations.html, careers.html, careers-coo.html, careers-cdo.html, careers-cgo.html, executive-candidate-information.html, digital-assets.html, solutions.html, energy-markets-commercial.html, milestones.html, contact.html; plus README.md. Code review does not independently authenticate finances, corporate records, employment terms, project contracts, biographies or actual website deployment.
Never infer US LLC cash, revenue, assets, customers, committed funding, cap table, governance appointments or operating authority from international programs. Pending facts must not be presented as verified.

## P0 file-by-file plan
| File | Existing observation | Safe review-branch action | Requires evidence before further edits/publication | Acceptance |
|---|---|---|---|---|
| index.html | Digital Infrastructure headline outranks energy-first company identity. | Updated hero headline to "Energy Infrastructure First. Digital Innovation Built on Top." | Confirm approved brand messaging; check line wrapping/mobile layout. | Hero matches energy-led strategy; no unverified operational achievement added. |
| about.html | HK shareholding and US operating independence are described; corporate address, entity number and amendment dates provided. | Preserve exact current statements pending legal verification; plan structured legal-entity diagram. | CA SOS entity record; HK ownership ledger; LLC operating agreement; signing/management authority; address-use confirmation. | Separate ownership, management and historical business; diagram legal-reviewed. |
| corporate-identity.html | Independence, HK ownership and US strategy claims appear alongside governance explanations. | Plan consistency check against About/Executive Candidate pages. | Ownership %, legal entities, amendment and authority documentation. | Same descriptions and entity names on all pages. |
| leadership.html | Management, board and compensation-committee claims may be interpreted as governance of California LLC. | Do not rename/remove any person or appoint a board based only on website text; plan entity-affiliation labels. | Appointments, committee charters, governance records, bios/experience verification, individual publication consent. | Each listed person has verified role + legal entity; no implied US board without evidence. |
| corporate-performance.html | "documented" wording can overstate independent verification; lists HK$1B, $200M, $300M, $500M, MWh/EH/s figures and project claims. | Changed two proof-implying headings to 'international' and 'published'. | Source evidence per claim; responsible legal entity; funded vs targeted vs committed vs deployed; owned vs managed compute; dates and period. | Each significant number has validated owner/status/source; unresolved claims held for review. |
| investor-relations.html | Refers to historical large capital programs; some 'documented' inference. | Replaced a proof-implying phrase with 'published international'. | Fund status, capitalization, actual commitment, independently verifiable sources, disclosures. | No historical funding read as US LLC available cash. |
| careers.html | Three senior roles, pay scale by HR request, US location and hiring context. | No fabricated pay ranges; plan legal/pay transparency review and clearer position-specific links. | Approved salary ranges, role status, states of employment, hiring entity, recruiting process. | Salary disclosures compliant for actual job locations; consistent with offer letters. |
| careers-coo.html | Broad operating mandate and generic 'competitive' compensation; future/conditional health and retirement benefits. | Plan first-year objectives and decision-rights section without invented approvals. | Reporting manager; actual delegated authority; approved budget; compensation; active benefits; location. | No candidate could mistake planned benefits for active benefits; targets match approved operating plan. |
| careers-cdo.html | Development mandate includes site/power/interconnection but not defined pipeline or approved resources. | Plan stage-gated objectives and project-category overview. | Site control, utility filings, engineering studies, actual development budget, compensation and authority. | No unverified site/customer/project stage claimed. |
| careers-cgo.html | Growth/market partnerships emphasized without verifiable signed-customer disclosure. | Plan commercial priorities and appropriate KPIs. | Signed vs prospective agreements, go-to-market budgets, approved comp, actual sales remit. | Do not imply booked revenue absent contracts. |
| executive-candidate-information.html | Already distinguishes HK history and US LLC, but publishes specific historical claims and describes confidential financial review. | Plan evidence-linked FAQ and discreet confidential diligence request; avoid stating financial documents are available unless ready. | Actual diligence process; corporate and historical data, pay/equity plans, governance authority. | Candidate can locate employer/role info and request verified private materials. |
| milestones.html | 2013-2026 association timeline; US entity separate since 2026. | Plan consistent ownership markers for each year. | Underlying entities and relevant evidence for historical milestones. | US record cannot be confused with predecessor/international results. |

## P1 file-by-file plan
| File | Action | Gate |
|---|---|---|
| solutions.html | Label offerings as established capability / under development / strategic direction, only where company confirms the status. | Product/project owner sign-off. |
| digital-assets.html | Preserve energy-led positioning, label STERRA and digital-asset functions by verified maturity stage. | Technical/legal validation. |
| energy-markets-commercial.html | Preserve existing explicit disclaimer: potential models are not signed contracts or current revenue. Use as reference for other digital pages. | Commercial/regulatory approval. |
| contact.html | Verify address, entity ID, contact channels and safe inquiry routing. | Corporate record and email/form test. |
| Navigation/header/footer across pages | Group secondary digital topics beneath primary business categories without breaking links; check mobile menu, canonicals and footer consistency. | Link and device QA. |
| README.md | Keep publication safeguards: main deploys via GitHub Pages; governance page + 8 PDFs remain isolated in hold branch. | No production release without signed approval. |

## Verification requests (NOT established by web content)
- V01 California LLC name, registration number, amendment and address: CA SOS records and address authorization.
- V02 HK and US legal entities, shareholding percentages, beneficial ownership and control: operating agreement/cap table/share register.
- V03 Actual US reporting, signing, budget and manager/board authority: appointment documents/consents.
- V04 2013-2026 achievements and capital: signed fund documents, custodian/admin/accountant verification, project contracts; distinct status for target/raised/committed/deployed funds.
- V05 MWh/MW, transformer ratings, power-price benchmarks and global EH/s metrics: dates, methodology, ownership vs managed vs associated capacity, counterparties.
- V06 US operating status: bank/cash runway, committed sources, approved budgets and obligations (confidential only).
- V07 US project pipeline: actual counterparties, stage, site control, utility/interconnection and customer agreement status.
- V08 Role-specific salary ranges, equity/RSU plans, benefits and work location: HR/legal-approved employer documents; do not fabricate.
- V09 Leadership biographies and committee titles: appointing entity, legal responsibilities and consent.
- V10 STERRA, BTC compute and market services: stage, buyer, licensing/compliance claims; do not imply live product without proof.

## P0 release gates
1. Legal signs off entity, governing-body, ownership, public claims and privacy notices.
2. Finance verifies source and exact status of every capital number; claims without credible evidence are removed or withheld, not embellished.
3. Operations/commercial signs off project maturity and customer claims.
4. HR/legal signs off actual salary range obligations, employee benefits, jurisdiction and offer consistency.
5. Verify no unintended assets/hold PDFs published, all links work, accessibility/mobile presentation works, and no unsupported headline claims remain.
6. Review diff and explicitly approve merge; never auto-merge review branch.

## Changes implemented in this review branch
- index.html: energy-first headline (wording only; verify responsive styling).
- corporate-performance.html: two headings converted from proof-implying wording to international/published framing.
- investor-relations.html: 'documented infrastructure' phrase converted to 'published international infrastructure' framing.
- This audit plan file, retained on review branch.

## Not performed
No funding/project/entity claims verified; no pay ranges, RSU percentages or benefits invented; no personnel reclassified; no governance PDF restored; no main merge or publication.
