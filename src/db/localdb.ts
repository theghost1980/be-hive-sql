import fs from "fs/promises";
import path from "path";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

sqlite3.verbose();

export interface LogEntry {
  id?: number;
  username: string;
  action: string;
  timestamp?: number;
}

/**
 * Notes:
 * amount: i.e: 1 HIVE, 2 HIVE etc.
 * comment_permlink: will be used to stablish if the onboarding comment was made, if present so we could update it as needed
 */
export interface OnboardingEntry {
  id?: number;
  onboarder: string;
  onboarded: string;
  amount: string;
  memo: string;
  comment_permlink?: string;
  timestamp?: number;
}

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initDB(): Promise<void> {
  const dbPath = path.resolve(__dirname, "../data/onboarding.db");
  const dbDir = path.dirname(dbPath);

  try {
    await fs.mkdir(dbDir, { recursive: true });
  } catch (err) {
    console.error(`Error al crear el directorio de la base de datos: ${err}`);
    throw err;
  }

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        action TEXT NOT NULL,
        timestamp INTEGER NOT NULL
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS onboardings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        onboarder TEXT NOT NULL,
        onboarded TEXT NOT NULL,
        amount TEXT NOT NULL,
        memo TEXT NOT NULL,
        comment_permlink TEXT,
        timestamp INTEGER NOT NULL
      );
    `);
  } catch (err) {
    console.error(`Error al inicializar la base de datos: ${err}`);
    throw err;
  }
}

export async function insertLog(entry: LogEntry): Promise<void> {
  const timestamp = entry.timestamp ?? Date.now();
  await db.run(
    "INSERT INTO logs (username, action, timestamp) VALUES (?, ?, ?)",
    entry.username,
    entry.action,
    timestamp
  );
}

export async function insertOnboarding(entry: OnboardingEntry): Promise<void> {
  const timestamp = entry.timestamp ?? Date.now();
  await db.run(
    "INSERT INTO onboardings (onboarder, onboarded, amount, memo, comment_permlink, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
    entry.onboarder,
    entry.onboarded,
    entry.amount,
    entry.memo,
    entry.comment_permlink,
    timestamp
  );
}

export async function getLogsByUsername(username: string): Promise<LogEntry[]> {
  return db.all<LogEntry[]>(
    "SELECT * FROM logs WHERE username = ? ORDER BY timestamp DESC",
    username
  );
}

export async function getOnboardingByPair(
  onboarder: string,
  onboarded: string
): Promise<OnboardingEntry[]> {
  return db.all<OnboardingEntry[]>(
    "SELECT * FROM onboardings WHERE onboarder = ? AND onboarded = ?",
    onboarder,
    onboarded
  );
}

export async function getOnboarded(
  onboarded: string
): Promise<OnboardingEntry[]> {
  return db.all<OnboardingEntry[]>(
    "SELECT * FROM onboardings WHERE onboarded = ?",
    onboarded
  );
}

export async function getAllOnboardings(): Promise<OnboardingEntry[]> {
  return db.all<OnboardingEntry[]>(
    "SELECT * FROM onboardings ORDER BY timestamp DESC"
  );
}

export async function getOnboardingsByOnboarder(
  onboarder: string
): Promise<OnboardingEntry[]> {
  return db.all<OnboardingEntry[]>(
    "SELECT * FROM onboardings WHERE onboarder = ? ORDER BY timestamp DESC",
    onboarder
  );
}

export async function updateLog(
  id: number,
  updatedFields: Partial<LogEntry>
): Promise<void> {
  const fields = [];
  const values = [];

  if (updatedFields.username !== undefined) {
    fields.push("username = ?");
    values.push(updatedFields.username);
  }
  if (updatedFields.action !== undefined) {
    fields.push("action = ?");
    values.push(updatedFields.action);
  }
  if (updatedFields.timestamp !== undefined) {
    fields.push("timestamp = ?");
    values.push(updatedFields.timestamp);
  }

  if (fields.length === 0) return;

  values.push(id);
  const query = `UPDATE logs SET ${fields.join(", ")} WHERE id = ?`;
  await db.run(query, ...values);
}

export async function updateOnboarding(
  id: number,
  updatedFields: Partial<OnboardingEntry>
): Promise<void> {
  const fields = [];
  const values = [];

  if (updatedFields.onboarder !== undefined) {
    fields.push("onboarder = ?");
    values.push(updatedFields.onboarder);
  }
  if (updatedFields.onboarded !== undefined) {
    fields.push("onboarded = ?");
    values.push(updatedFields.onboarded);
  }
  if (updatedFields.amount !== undefined) {
    fields.push("amount = ?");
    values.push(updatedFields.amount);
  }
  if (updatedFields.memo !== undefined) {
    fields.push("memo = ?");
    values.push(updatedFields.memo);
  }
  if (updatedFields.comment_permlink !== undefined) {
    fields.push("comment_permlink = ?");
    values.push(updatedFields.comment_permlink);
  }
  if (updatedFields.timestamp !== undefined) {
    fields.push("timestamp = ?");
    values.push(updatedFields.timestamp);
  }

  if (fields.length === 0) return;

  values.push(id);
  const query = `UPDATE onboardings SET ${fields.join(", ")} WHERE id = ?`;
  await db.run(query, ...values);
}
