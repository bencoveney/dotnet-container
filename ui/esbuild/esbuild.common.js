import fs from "node:fs";
import path from "node:path";

export const staticAssetsPath = "./static";
export const certificatesPath = "./esbuild/certs";

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

export function loadEnvFile(from) {
  const content = fs.readFileSync(from, "utf8");
  const lines = content.split(/\r?\n/).filter((line) => !!line);
  lines.forEach((line) => {
    const [key, value] = line.split("=").map((val) => val.trim());
    process.env[key] = value;
  });
}

export function loadCertificates(from) {
  const exists = fs.existsSync(from);
  if (!exists) {
    return;
  }
  return {
    key: fs.readFileSync(path.join(from, "localhost.key")),
    cert: fs.readFileSync(path.join(from, "localhost.crt")),
  };
}
