import mysql from "mysql2/promise";

if (!process.env.MARIADB_URL) {
  console.error("MARIADB_URL is not set.");
  process.exit(1);
}

const connection = await mysql.createConnection(process.env.MARIADB_URL);
const [rows] = await connection.query("SELECT VERSION() AS version");
console.log(`Connected to MariaDB/MySQL ${rows[0].version}`);
await connection.end();
