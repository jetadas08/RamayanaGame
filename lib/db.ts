import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

type DbValue = string | number | boolean | Date | Buffer | null;

const globalForMaria = globalThis as unknown as { mariaPool?: Pool; mariaReady?: Promise<void> };

function connectionUrl() {
  const value = process.env.MARIADB_URL;
  if (!value) throw new Error("MARIADB_URL is not configured. Guest progress remains available without it.");
  return value;
}

export function getDb() {
  if (!globalForMaria.mariaPool) {
    globalForMaria.mariaPool = mysql.createPool({
      uri: connectionUrl(),
      connectionLimit: 8,
      enableKeepAlive: true,
      charset: "utf8mb4",
    });
  }
  return globalForMaria.mariaPool;
}

export async function ensureSchema() {
  if (!globalForMaria.mariaReady) {
    globalForMaria.mariaReady = (async () => {
      const db = getDb();
      await db.execute(`CREATE TABLE IF NOT EXISTS user_profiles (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
      await db.execute(`CREATE TABLE IF NOT EXISTS user_sessions (
        id CHAR(36) PRIMARY KEY,
        token_hash CHAR(64) NOT NULL UNIQUE,
        user_id CHAR(36) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sessions_user (user_id),
        CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
      await db.execute(`CREATE TABLE IF NOT EXISTS journey_progress (
        user_id CHAR(36) PRIMARY KEY,
        current_node VARCHAR(12) NOT NULL DEFAULT 'HJ-01',
        completed_nodes LONGTEXT NOT NULL,
        unlocked_characters LONGTEXT NOT NULL,
        unlocked_relationships LONGTEXT NOT NULL,
        answered_challenges LONGTEXT NOT NULL,
        relationship_challenges LONGTEXT NULL,
        encounter_progress LONGTEXT NULL,
        achievements LONGTEXT NOT NULL,
        difficulty ENUM('explorer','seeker','scholar') NOT NULL DEFAULT 'explorer',
        reset_epoch VARCHAR(36) NOT NULL DEFAULT '',
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
      await db.execute("ALTER TABLE journey_progress ADD COLUMN IF NOT EXISTS relationship_challenges LONGTEXT NULL AFTER answered_challenges");
      await db.execute("ALTER TABLE journey_progress ADD COLUMN IF NOT EXISTS encounter_progress LONGTEXT NULL AFTER relationship_challenges");
      await db.execute("ALTER TABLE journey_progress ADD COLUMN IF NOT EXISTS reset_epoch VARCHAR(36) NOT NULL DEFAULT '' AFTER difficulty");
    })().catch(error => { globalForMaria.mariaReady = undefined; throw error; });
  }
  return globalForMaria.mariaReady;
}

export async function queryRows<T extends RowDataPacket[]>(sql: string, values: DbValue[] = []) {
  await ensureSchema();
  const [rows] = await getDb().execute<T>(sql, values);
  return rows;
}

export async function execute(sql: string, values: DbValue[] = []) {
  await ensureSchema();
  const [result] = await getDb().execute<ResultSetHeader>(sql, values);
  return result;
}
