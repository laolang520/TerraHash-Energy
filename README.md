# TerraHash Energy

Source repository for the **TerraHash Energy LLC corporate website** and related technical reference materials.

The published corporate website is built and deployed from the repository root. TerraHash Energy LLC is a California limited liability company (Entity No. B20260383401). The site distinguishes California company filings, ongoing U.S. development activity, and historical milestones involving international or associated businesses.

Technical prototypes, example data, and reference materials included in this repository are not, by themselves, proof of commercial deployment, funded projects, or financial services. The website does not constitute a securities offering, investment recommendation, or token offering.

## Repository structure

- Root `*.html` — production corporate website pages
- `assets/` and other root media — website images and supporting static assets
- `web/` — earlier static website or prototype materials
- `docs/` — supporting corporate or product documentation
- `contracts/` — example digital-asset interface prototypes, not for handling real funds
- `data/` — example renewable-energy project datasets
- `.github/workflows/pages.yml` — production GitHub Pages deployment

## Local preview

To preview the live website source locally, run from the repository root:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Deployment

GitHub Actions publishes the website from the repository root when changes are merged into `main`. Review the deployment workflow before changing publishing behavior.

## Homepage Visual

The current homepage hero uses `assets/second-image-en.jpg`.

## Recruitment email applications

The production site is published from the repository root by `.github/workflows/pages.yml` on pushes to `main`.

The three executive role pages (`careers-cdo.html`, `careers-coo.html`, and `careers-cgo.html`) now offer **Apply by Email** links addressed to `hr@terrahashenergy.com`. Each link pre-fills the relevant position in the subject and an English application template in the message body, retaining the information requested by the previous form.

Applicants complete the draft in their own email app, attach their resume, and send it themselves. The link does not send mail or attach files automatically. The visible HR address and expandable template can also be copied into webmail if no default email app is configured. Resume attachment limits depend on the sender and recipient email providers.

Recruitment no longer uses FormSubmit, activation emails, web uploads, or website submission confirmations. The existing general contact page remains separate. The role pages require no JavaScript for the email links or template disclosure.

Mailto format: https://www.rfc-editor.org/rfc/rfc6068.
