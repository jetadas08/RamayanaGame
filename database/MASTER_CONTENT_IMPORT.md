# Follow Hanumān master content

`data/hanuman-master-content.json` preserves the 35 records and all five sheets from `Follow_Hanuman_35_Node_Master_Content_Map.xlsx`, with the workbook SHA-256 for provenance. Source verification flags are imported claims, not a new independent source audit.

The campaign event catalog consumes these IDs and chapter assignments. The 15 existing HJ nodes remain playable with their existing progress keys; the 20 new records remain planned. Chapter counts are 5, 5, 5, 3, 4, 6, 3, 4. Gameplay and new artwork require a separate implementation.

To validate: `node scripts/import-master-content.mjs --validate`.

To import into MariaDB: configure `MARIADB_URL` in the environment or `.env.local`, then run `node scripts/import-master-content.mjs`. The command creates `campaign_content_catalog`, upserts by campaign/node ID in a transaction, verifies the stored records, and does not modify player tables. Run with Node 22 or later. No live MariaDB import has been performed on this device because its connection is not configured.
