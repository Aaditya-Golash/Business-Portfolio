const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of ["index.html", "styles.css"]) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

const assetsSource = path.join(root, "assets");
const assetsTarget = path.join(dist, "assets");

if (fs.existsSync(assetsSource)) {
  fs.cpSync(assetsSource, assetsTarget, { recursive: true });
}

console.log("Built static portfolio into dist/");
