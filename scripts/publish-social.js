#!/usr/bin/env node

const fs = require("fs");

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)).trimEnd() + "…";
}

function buildXText(a) {
  const url = a.url || "";
  const reserved = url ? url.length + 2 : 0;
  const body = [a.title, a.summary].filter(Boolean).join("\n\n");
  return url ? `${truncate(body, 280 - reserved)}\n\n${url}` : truncate(body, 280);
}

function buildLinkedInText(a) {
  return [a.title, a.summary, a.url].filter(Boolean).join("\n\n");
}

async function postX(text) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) {
    console.log("X: skipped (X_BEARER_TOKEN is not configured)");
    return;
  }

  const res = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const body = await res.text();
  if (!res.ok) throw new Error(`X publish failed (${res.status}): ${body}`);
  console.log("X: published successfully");
}

async function postLinkedIn(text) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;
  if (!token || !orgId) {
    console.log("LinkedIn: skipped (LINKEDIN_ACCESS_TOKEN / LINKEDIN_ORGANIZATION_ID not configured)");
    return;
  }

  const version = process.env.LINKEDIN_API_VERSION || "202609";
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Linkedin-Version": version,
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      author: `urn:li:organization:${orgId}`,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: []
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false
    })
  });

  const body = await res.text();
  if (!res.ok) throw new Error(`LinkedIn publish failed (${res.status}): ${body}`);
  console.log("LinkedIn: published successfully");
}

async function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.log("No announcement files supplied.");
    return;
  }

  for (const file of files) {
    const a = JSON.parse(fs.readFileSync(file, "utf8"));

    if (a.publish !== true) {
      console.log(`${file}: skipped because publish is not true`);
      continue;
    }

    const platforms = Array.isArray(a.platforms) ? a.platforms : ["x", "linkedin"];
    console.log(`Publishing ${file}: ${a.title || "(untitled)"}`);

    if (platforms.includes("x")) await postX(buildXText(a));
    if (platforms.includes("linkedin")) await postLinkedIn(buildLinkedInText(a));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
