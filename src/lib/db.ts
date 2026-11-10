import fs from 'node:fs';
import path from 'node:path';

interface SQLiteStatement {
  run(...params: (string | number | boolean | null)[]): {
    lastInsertRowid: number | bigint;
    changes: number;
  };
  all(...params: (string | number | boolean | null)[]): unknown[];
  get(...params: (string | number | boolean | null)[]): unknown;
}

interface SQLiteDatabase {
  exec(sql: string): void;
  prepare(sql: string): SQLiteStatement;
}

function resolveSqlitePath(): string {
  const envPath = process.env.LOCAL_SQLITE_PATH;
  if (envPath) {
    return path.resolve(/*turbopackIgnore: true*/ process.cwd(), envPath);
  }

  const primary = path.join(/*turbopackIgnore: true*/ process.cwd(), '..', 'urivalent_backend', 'database', 'urivalent.db');
  if (fs.existsSync(primary)) {
    return primary;
  }

  const sibling = path.join(/*turbopackIgnore: true*/ process.cwd(), 'urivalent_backend', 'database', 'urivalent.db');
  if (fs.existsSync(sibling)) {
    return sibling;
  }

  fs.mkdirSync(path.dirname(primary), { recursive: true });
  return primary;
}

let sqliteInstance: SQLiteDatabase | null = null;

function getSqliteDb(): SQLiteDatabase {
  if (!sqliteInstance) {
    const dbPath = resolveSqlitePath();
    // Use runtime require to bypass bundler static resolution for node:sqlite
    const nodeRequire = eval('require');
    const { DatabaseSync } = nodeRequire('node:sqlite');
    sqliteInstance = new DatabaseSync(dbPath) as SQLiteDatabase;

    // Ensure subscribers and users tables exist
    sqliteInstance.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        created_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT UNIQUE,
        is_active INTEGER DEFAULT 1,
        is_verified INTEGER DEFAULT 1,
        is_subscribed INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  return sqliteInstance;
}

export interface QueryResult {
  lastInsertRowid?: number | bigint;
  changes?: number;
}

export const db = {
  /**
   * STRICTLY PARAMETERIZED database execution.
   * Parameter values must ALWAYS be supplied in the `params` array.
   * AGENT RULE: NEVER use string interpolation/template literals for SQL queries.
   */
  async execute(
    query: string,
    params: (string | number | boolean | null)[] = []
  ): Promise<QueryResult> {
    const useCfD1 =
      process.env.USE_CLOUDFLARE_D1?.trim().toLowerCase() === 'true';

    if (useCfD1) {
      const accountId = process.env.CF_ACCOUNT_ID;
      const dbId = process.env.CF_D1_DATABASE_ID;
      const token = process.env.CF_API_TOKEN;

      if (!accountId || !dbId || !token) {
        throw new Error('Cloudflare D1 credentials missing in environment.');
      }

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sql: query,
            params: params,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(
          `D1 error: ${JSON.stringify(data.errors || data)}`
        );
      }

      const meta = data.result?.[0]?.meta || {};
      return {
        lastInsertRowid: meta.last_row_id,
        changes: meta.changes ?? 0,
      };
    }

    // Local SQLite Execution with STRICT PARAMETER BINDING
    const sqlite = getSqliteDb();
    const statement = sqlite.prepare(query);
    const result = statement.run(...params);
    return {
      lastInsertRowid: result.lastInsertRowid,
      changes: result.changes,
    };
  },

  /**
   * Helper function to safely record a subscriber into both subscribers and users tables
   * using strictly parameterized SQL queries.
   */
  async insertSubscriber(email: string): Promise<void> {
    // 1. Insert into subscribers table with parameter binding
    await this.execute(
      'INSERT OR IGNORE INTO subscribers (email) VALUES (?)',
      [email]
    );

    // 2. Also register / update users table for backend intelligence dispatch compatibility
    const username = email.split('@')[0] || 'subscriber';
    await this.execute(
      'INSERT OR IGNORE INTO users (email, username, is_active, is_verified, is_subscribed) VALUES (?, ?, 1, 1, 1)',
      [email, username]
    );
  },
};
