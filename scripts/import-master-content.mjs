import fs from "node:fs/promises";
import mysql from "mysql2/promise";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

for (const file of [".env.local", ".env"]) if (existsSync(file)) loadEnvFile(file);
const catalog = JSON.parse(await fs.readFile(new URL("../data/hanuman-master-content.json", import.meta.url), "utf8"));
const ids = catalog.nodes.map(node => node.id);
if (ids.length !== 35 || new Set(ids).size !== 35) throw new Error("Expected 35 unique nodes.");
for (let i = 1; i <= 15; i++) {
  if (!ids.includes("HJ-" + String(i).padStart(2, "0"))) throw new Error("Missing legacy node.");
}
if (process.argv.includes("--validate")) {
  console.log("Validated 35 nodes, all 15 legacy IDs, and " + Object.keys(catalog.sheets).length + " source sheets.");
  process.exit(0);
}
if (!process.env.MARIADB_URL) throw new Error("MARIADB_URL is required. Catalog is saved locally; no database was modified.");
const db = await mysql.createConnection(process.env.MARIADB_URL);
try {
  await db.query(await fs.readFile(new URL("../database/master-content.sql", import.meta.url), "utf8"));
  await db.beginTransaction();
  for (const node of catalog.nodes) {
    await db.execute(
      "INSERT INTO campaign_content_catalog (campaign_id, node_id, canonical_order, chapter_id, title, build_status, content_json, source_file, source_sha256) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE canonical_order=VALUES(canonical_order), chapter_id=VALUES(chapter_id), title=VALUES(title), build_status=VALUES(build_status), content_json=VALUES(content_json), source_file=VALUES(source_file), source_sha256=VALUES(source_sha256)",
      ["hanuman", node.id, node.order, node.chapterId, node.title, node.buildStatus, JSON.stringify({node, supportingSheets: catalog.sheets, sourceClaimsIndependentlyVerified: false}), catalog.sourceFile, catalog.sourceSha256]
    );
  }
  const [rows] = await db.execute("SELECT node_id, content_json FROM campaign_content_catalog WHERE campaign_id = ? AND source_sha256 = ?", ["hanuman", catalog.sourceSha256]);
  if (rows.length !== 35) throw new Error("Import verification failed.");
  for (const row of rows) {
    if (JSON.stringify(JSON.parse(row.content_json).node) !== JSON.stringify(catalog.nodes.find(node => node.id === row.node_id))) throw new Error("Stored record differs: " + row.node_id);
  }
  await db.commit();
  console.log("Imported and verified 35 campaign content records. Player tables were not modified.");
} catch (error) {
  await db.rollback();
  throw error;
} finally {
  await db.end();
}
