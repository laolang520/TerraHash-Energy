# Social announcement sync

This repository can automatically publish approved website announcements to X and LinkedIn after a JSON file is pushed to `main` under `announcements/`.

## Announcement format

Create a file such as:

`announcements/2026-09-27-company-update.json`

Example:

```json
{
  "title": "TerraHash Energy Announces ...",
  "summary": "Short public summary.",
  "url": "https://www.terrahashenergy.com/your-announcement.html",
  "publish": true,
  "platforms": ["x", "linkedin"]
}
```

Only files with `"publish": true` are sent.

## GitHub configuration

In **Settings → Secrets and variables → Actions**, add:

### Secrets

- `X_BEARER_TOKEN` — OAuth 2.0 user access token with permission to create posts.
- `LINKEDIN_ACCESS_TOKEN` — LinkedIn member access token authorized for organization posting.
- `LINKEDIN_ORGANIZATION_ID` — numeric LinkedIn organization/page ID.

### Optional variable

- `LINKEDIN_API_VERSION` — LinkedIn API version in `YYYYMM` form. If omitted, the script uses `202609`.

## LinkedIn requirements

The authorized LinkedIn member must have permission to post on behalf of the organization and the app/token must include `w_organization_social`.

## Safety behavior

- Normal website code changes do not trigger social publishing.
- Announcement files with `publish: false` are ignored.
- If a platform credential is missing, that platform is skipped rather than exposing secrets or failing unexpectedly.
- A failed API response stops the workflow and leaves an error in GitHub Actions for review.

## Manual re-publish

Open **Actions → Publish announcements to social media → Run workflow** and enter the announcement JSON path.
