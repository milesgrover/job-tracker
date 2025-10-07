import mysql from "mysql2/promise";

declare global {
  // Allow global `pool` to persist across hot reloads in dev
  // (otherwise TypeScript complains about redeclaration)
  var pool: mysql.Pool | undefined;
}

export function getDB(): mysql.Pool {
  if (!global.pool) {
    const url = new URL(process.env.DATABASE_URL!);
    global.pool = mysql.createPool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port ? parseInt(url.port) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return global.pool;
}

export async function queryWithRetry<T = any>(
  sql: string,
  params?: any[]
): Promise<[T]> {
  const pool = getDB();
  try {
    const [rows] = await pool.query(sql, params);
    return [rows as T];
  } catch (err: any) {
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
      console.warn("Retrying after query connection reset...");
      const [rows] = await pool.query(sql, params);
      return [rows as T];
    }
    throw err;
  }
}
