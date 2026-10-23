import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { inlineScripts } from "./csp-policy.mjs";

/** `'sha256-…'` of a script's exact text, the form a Content-Security-Policy `script-src` takes. */
function scriptHash(body) {
  return `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`;
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    return statSync(file).isDirectory() ? htmlFiles(file) : name.endsWith(".html") ? [file] : [];
  });
}

/** Every distinct inline script hash across the built pages, sorted so the output is stable. */
export function collectScriptHashes(outDir) {
  const hashes = new Set();
  for (const file of htmlFiles(outDir)) for (const body of inlineScripts(readFileSync(file, "utf8"))) hashes.add(scriptHash(body));
  return [...hashes].sort();
}


export { headersFile, redirectsFile } from "./csp-policy.mjs";
