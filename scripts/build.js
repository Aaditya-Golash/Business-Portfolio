const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

function normalizeSiteUrl(value) {
  if (!value) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

const siteUrl = normalizeSiteUrl(
  process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
);

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const sourceHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const canonicalMarkup = siteUrl
  ? [
      `<link rel="canonical" href="${siteUrl}/" />`,
      `<meta property="og:url" content="${siteUrl}/" />`
    ].join("\n    ")
  : "";

const html = sourceHtml
  .replace("<!-- SEO_CANONICAL -->", canonicalMarkup)
  .replaceAll(
    'content="assets/aaditya-golash-headshot.jpg"',
    `content="${siteUrl ? `${siteUrl}/` : ""}assets/aaditya-golash-headshot.jpg"`
  )
  .replaceAll(
    '"image": "assets/aaditya-golash-headshot.jpg"',
    `"image": "${siteUrl ? `${siteUrl}/` : ""}assets/aaditya-golash-headshot.jpg"`
  );

fs.writeFileSync(path.join(dist, "index.html"), html);
fs.copyFileSync(path.join(root, "styles.css"), path.join(dist, "styles.css"));

const assetsSource = path.join(root, "assets");
const assetsTarget = path.join(dist, "assets");

if (fs.existsSync(assetsSource)) {
  fs.cpSync(assetsSource, assetsTarget, { recursive: true });
}

const robots = [
  "User-agent: *",
  "Allow: /",
  siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml` : ""
]
  .filter(Boolean)
  .join("\n");

fs.writeFileSync(path.join(dist, "robots.txt"), `${robots}\n`);

if (siteUrl) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
}

console.log(`Built static portfolio into dist/${siteUrl ? ` with canonical URL ${siteUrl}/` : ""}`);
