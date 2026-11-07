# TerraHash Energy — Corporate Website

The production website at https://www.terrahashenergy.com/ is published from **the repository root** through `.github/workflows/pages.yml` on pushes to `main`. The `web/` folder is a legacy site prototype, not the primary deployed homepage.

## Repository layout

- Root `*.html`, `styles.css`, `script.js`: public corporate website.
- `milestone-history/`: confirmed international development history (2013–2026) as published by TerraHash Energy; retain historical achievements and quantitative reports.
- `leadership.html`: leadership, directors and advisory board profiles; preserve the company-confirmed personnel information.
- `design-previews/` and `*-preview.html`: non-production design prototypes.
- `downloads/governance/`: published governance PDF library.
- `data/projects.json`: existing project data. Do not remove entries without approval.
- `docs/CONTENT_AUDIT_2026-11-06.md`: site content consistency and technical review log.

## Editorial guidance

Keep the verified international development record, management and board information intact. Use consistent wording to distinguish the international historical corporate chapter from the U.S. LLC's independent operational management without diminishing reported achievements. Do not substitute generic doubts or 'unverified' labels for company-confirmed information.

## Local preview

From the repository root, run `python -m http.server 8080` and open `http://localhost:8080/`.

## Homepage visual

The homepage uses the corporate hero image at `assets/homepage-hero.jpg`.

## Recruitment email applications

The executive role pages (`careers-cdo.html`, `careers-coo.html`, `careers-cgo.html`) use **Apply by Email** links addressed to `hr@terrahashenergy.com`. The links prefill the role-specific subject and a reusable application template in the sender's email program.

The sender must review the draft, add attachments, and send the message. These links do not submit a form or upload resumes automatically. The separate general inquiry form on `contact.html` uses FormSubmit.

Mailto reference: https://www.rfc-editor.org/rfc/rfc6068.
