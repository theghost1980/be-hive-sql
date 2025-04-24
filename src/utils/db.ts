import dotenv from "dotenv";
import sql from "mssql";
import { TimeUtils } from "./times.util";

dotenv.config();

const sqlConfig = {
  user: process.env.HIVE_USER!,
  password: process.env.HIVE_PASSWORD!,
  database: process.env.HIVE_DATABASE!,
  server: process.env.HIVE_HOST!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
  requestTimeout: 120000,
};

export const queryDB = async (query: string) => {
  await sql.connect(sqlConfig);
  const result = await sql.query`${query}`;
  return result;
};

export const testConnection = async (): Promise<{
  results: any[];
  time_ms: any;
} | null> => {
  try {
    await sql.connect(sqlConfig);
    const start = TimeUtils.start();
    const result = await sql.query`SELECT TOP 1 name, created FROM Accounts;`;
    const timeExecutionQuery = TimeUtils.calculate(start);
    return { time_ms: timeExecutionQuery, results: result.recordset };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function executeQuery<T>(query: string): Promise<{
  results: T[];
  time: number;
}> {
  try {
    const pool = await sql.connect(sqlConfig); // Establecer la conexión
    const start = TimeUtils.start();
    const result = await pool.request().query<T>(query);
    const timeExecutionQuery = TimeUtils.calculate(start);
    return { results: result.recordset, time: timeExecutionQuery };
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    throw error;
  }
}
