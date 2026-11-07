# TerraHash Energy — Corporate Website

The production website at https://www.terrahashenergy.com/ is published from **the repository root** through `.github/workflows/pages.yml` when `main` changes. The `web/` folder is a legacy prototype and is not the primary deployed homepage.

## Repository layout

- Root `*.html`, `styles.css` and `script.js`: public corporate website.
- `milestone-history/`: earlier international-business reports; material claims currently require primary-source verification and legal-entity attribution.
- `design-previews/` and `*-preview.html`: non-production previews, not intended for search indexing.
- `downloads/governance/`: governance PDF library; identify each document's legal entity and approval status before relying on it.
- `data/projects.json`: deliberately empty until actual public project records are authorized and verified; no sample projects should appear as operating assets.
- `docs/CONTENT_AUDIT_2026-11-06.md`: content accuracy and evidence checklist.

## Editorial controls

Do not publish financing amounts, fund closings, operating hashrates, commissioned project capacities, named partnerships, ownership claims or audited-performance descriptions without appropriate source documents, entity identification and authorized approval. Conceptual STERRA / RWA / tokenization material is not a representation of an issued token or an offered investment product.

## Local preview

Run `python -m http.server 8080` from the repository root and open `http://localhost:8080/`.

## Homepage Visual

The homepage uses the English corporate hero visual at `assets/homepage-hero.jpg`.

## Recruitment email applications

The production site is published from the repository root by `.github/workflows/pages.yml` on pushes to `main`.

The three executive role pages (`careers-cdo.html`, `careers-coo.html`, and `careers-cgo.html`) now offer **Apply by Email** links addressed to `hr@terrahashenergy.com`. Each link pre-fills the relevant position in the subject and an English application template in the message body, retaining the information requested by the previous form.

Applicants complete the draft in their own email app, attach their resume, and send it themselves. The link does not send mail or attach files automatically. The visible HR address and expandable template can also be copied into webmail if no default email app is configured. Resume attachment limits depend on the sender and recipient email providers.

Recruitment no longer uses FormSubmit, activation emails, web uploads, or website submission confirmations. The existing general contact page remains separate. The role pages require no JavaScript for the email links or template disclosure.

Mailto format: https://www.rfc-editor.org/rfc/rfc6068.
