CREATE TABLE IF NOT EXISTS campaign_content_catalog (
  campaign_id VARCHAR(40) NOT NULL,
  node_id VARCHAR(20) NOT NULL,
  canonical_order INT NOT NULL,
  chapter_id VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  build_status VARCHAR(40) NOT NULL,
  content_json LONGTEXT NOT NULL CHECK (JSON_VALID(content_json)),
  source_file VARCHAR(255) NOT NULL,
  source_sha256 CHAR(64) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (campaign_id, node_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
