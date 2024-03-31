import fs from "node:fs";
import path from "node:path";

export const staticAssetsPath = "./static";

export const buildConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "./build",
};

export function cleanDirectory(dir) {
  // Create directory if it doesn't already exist.
  fs.mkdirSync(dir, { recursive: true });

  // Clean any detritus out.
  const files = fs.readdirSync(dir);
  for (const file of files) {
    fs.unlinkSync(path.join(dir, file));
  }
}

export function copyAssets(from, to) {
  fs.cpSync(from, to, { recursive: true });
}
