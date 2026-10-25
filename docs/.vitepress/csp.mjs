import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// The Content-Security-Policy, written into _headers at the end of the build with the hashes of the built pages' inline scripts.

const EXECUTABLE = /^(|module|text\/javascript|application\/javascript)$/i;

/**
 * The inline scripts of a page that the browser would run: no `src`, and not a data block such as JSON-LD (which
 * `script-src` does not govern). The text is exactly what lies between the tags, because that is what is hashed.
 */
export function inlineScripts(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1] ?? "";
    if (/\bsrc\s*=/.test(attrs)) continue;
    const type = /\btype\s*=\s*["']?([^"'\s>]*)/i.exec(attrs)?.[1] ?? "";
    if (!EXECUTABLE.test(type) || !m[2]) continue;
    out.push(m[2]);
  }
  return out;
}

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

/**
 * The policy. Scripts are the site's own files and the inline scripts listed by hash, so an injected script does not
 * run. Styles keep `'unsafe-inline'` for the style attributes Vue and the playground set.
 * There is no report-only copy of a stricter policy: nothing collects violation reports, so it would only add noise.
 */
function policy(hashes) {
  const script = ["'self'", ...hashes].join(" ");
  return `default-src 'self'; script-src ${script}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`;
}

/** The Cloudflare `_headers` file, generated at build so the hashes always match the pages written beside it. */
export function headersFile(hashes) {
  return `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Content-Security-Policy: ${policy(hashes)}

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;
}

/** The policy a built `_headers` file sets for every page, for the page checks to apply. */
export function policyOf(headers) {
  return /^\s*Content-Security-Policy:\s*(.+)$/m.exec(headers)?.[1]?.trim();
}
