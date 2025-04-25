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

export interface OnboardingEntry {
  id?: number;
  onboarder: string;
  onboarded: string;
  timestamp?: number;
}

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initDB(): Promise<void> {
  const dbPath = path.resolve(__dirname, "../data/onboarding.db");
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
      timestamp INTEGER NOT NULL
    );
  `);
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
    "INSERT INTO onboardings (onboarder, onboarded, timestamp) VALUES (?, ?, ?)",
    entry.onboarder,
    entry.onboarded,
    timestamp
  );
}

export async function getLogsByUsername(username: string): Promise<LogEntry[]> {
  return db.all<LogEntry[]>(
    "SELECT * FROM logs WHERE username = ? ORDER BY timestamp DESC",
    username
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
  if (updatedFields.timestamp !== undefined) {
    fields.push("timestamp = ?");
    values.push(updatedFields.timestamp);
  }

  if (fields.length === 0) return;

  values.push(id);
  const query = `UPDATE onboardings SET ${fields.join(", ")} WHERE id = ?`;
  await db.run(query, ...values);
}
