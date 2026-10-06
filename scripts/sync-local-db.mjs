#!/usr/bin/env node
// Salin data KONTEN (mitra, products, contact_settings) dari Dev DB ke DB lokal
// agar tampilan lokal sama dengan deployment dev.
// Data sensitif (transactions, users) sengaja TIDAK disalin.
//
// Foto mitra berupa data URL besar (>100KB) dan melebihi batas panjang satu
// statement SQL (SQLITE_TOOBIG), jadi disalin per potongan lewat UPDATE foto = foto || '...'.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const WORKER_DIR = resolve(ROOT, "api-worker");
const TMP_DIR = resolve(ROOT, ".wrangler");
const CHUNK = 60000;
const SMALL_TABLES = ["products", "contact_settings"];

mkdirSync(TMP_DIR, { recursive: true });

const wrangler = (args) =>
  execFileSync("npx", ["wrangler", ...args], {
    cwd: WORKER_DIR,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });

const remoteQuery = (sql) => {
  const out = wrangler(["d1", "execute", "DB", "--remote", "--json", "--command", sql, "--config", "wrangler.toml"]);
  return JSON.parse(out.slice(out.indexOf("[")))[0].results;
};

const localFile = (name, sql) => {
  const file = resolve(TMP_DIR, name);
  writeFileSync(file, sql);
  wrangler(["d1", "execute", "DB", "--local", "--file", file]);
  rmSync(file, { force: true });
};

const q = (v) => (v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);

console.log("==> Pastikan skema lokal ada…");
wrangler(["d1", "execute", "DB", "--local", "--file", resolve(ROOT, "schema.sql")]);

// ── Tabel kecil: export/import biasa ────────────────────────────────────────
console.log(`==> Salin ${SMALL_TABLES.join(", ")}…`);
const dump = resolve(TMP_DIR, "dev-content.sql");
wrangler([
  "d1", "export", "DB", "--remote", "--no-schema",
  ...SMALL_TABLES.flatMap((t) => ["--table", t]),
  "--output", dump, "--config", "wrangler.toml",
]);
localFile("clear-small.sql", SMALL_TABLES.map((t) => `DELETE FROM ${t};`).join("\n"));
wrangler(["d1", "execute", "DB", "--local", "--file", dump]);
rmSync(dump, { force: true });

// ── Mitra: foto disalin per potongan ────────────────────────────────────────
console.log("==> Salin mitra…");
const rows = remoteQuery("SELECT id, nama, kategori, created_at, COALESCE(length(foto), 0) AS len FROM mitra");
let sql = "DELETE FROM mitra;\n";
for (const r of rows) {
  sql += `INSERT INTO mitra (id, nama, kategori, foto, created_at) VALUES (${q(r.id)}, ${q(r.nama)}, ${q(r.kategori)}, ${r.len ? "''" : "NULL"}, ${r.created_at ?? "NULL"});\n`;
  for (let off = 0; off < r.len; off += CHUNK) {
    const [{ c }] = remoteQuery(`SELECT substr(foto, ${off + 1}, ${CHUNK}) AS c FROM mitra WHERE id = ${q(r.id)}`);
    sql += `UPDATE mitra SET foto = foto || ${q(c)} WHERE id = ${q(r.id)};\n`;
  }
  console.log(`    - ${r.nama} (${r.len} byte)`);
}
localFile("mitra.sql", sql);

console.log("Selesai. Data konten lokal sekarang sama dengan Dev.");
