export interface QueryResult {
  lastInsertRowid?: number | bigint;
  changes?: number;
}

export const db = {
  /**
   * STRICTLY PARAMETERIZED database execution.
   * Parameter values must ALWAYS be supplied in the `params` array.
   * AGENT RULE: NEVER use string interpolation/template literals for SQL queries.
   *
   * Fully Edge-compatible: Uses standard web `fetch` to Cloudflare D1 REST API,
   * requiring zero Node.js filesystem modules or native C++ SQLite binaries.
   */
  async execute(
    query: string,
    params: (string | number | boolean | null)[] = []
  ): Promise<QueryResult> {
    const accountId = process.env.CF_ACCOUNT_ID?.trim();
    const dbId = process.env.CF_D1_DATABASE_ID?.trim();
    const token = process.env.CF_API_TOKEN?.trim();

    if (!accountId || !dbId || !token) {
      console.warn('[db] Cloudflare D1 credentials missing. Simulation mode.');
      return { changes: 1 };
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

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(`D1 error: ${JSON.stringify(data.errors || data)}`);
    }

    const meta = data.result?.[0]?.meta || {};
    return {
      lastInsertRowid: meta.last_row_id,
      changes: meta.changes ?? 0,
    };
  },

  /**
   * Helper function to safely record a subscriber into both subscribers and users tables
   * using strictly parameterized SQL queries.
   */
  async insertSubscriber(email: string): Promise<void> {
    // 1. Insert into subscribers table with parameter binding
    await this.execute(
      'INSERT OR IGNORE INTO subscribers (email) VALUES (?1);',
      [email]
    );

    // 2. Also register / update users table for backend intelligence dispatch compatibility
    const username = email.split('@')[0] || 'subscriber';
    await this.execute(
      'INSERT OR IGNORE INTO users (email, username, is_active, is_verified, is_subscribed) VALUES (?1, ?2, 1, 1, 1);',
      [email, username]
    );
  },

  /**
   * Query records from Cloudflare D1 returning array of rows.
   */
  async query<T = Record<string, unknown>>(
    query: string,
    params: (string | number | boolean | null)[] = []
  ): Promise<T[]> {
    const accountId = process.env.CF_ACCOUNT_ID?.trim();
    const dbId = process.env.CF_D1_DATABASE_ID?.trim();
    const token = process.env.CF_API_TOKEN?.trim();

    if (!accountId || !dbId || !token) {
      console.warn('[db] Cloudflare D1 credentials missing. Simulation mode.');
      return [];
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

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(`D1 query error: ${JSON.stringify(data.errors || data)}`);
    }

    return (data.result?.[0]?.results as T[]) || [];
  },

  /**
   * Helper function to fetch all user and subscriber records directly from the database.
   */
  async getUsers(): Promise<Record<string, unknown>[]> {
    return this.query<Record<string, unknown>>(
      'SELECT id, username, email, is_active, is_verified, is_subscribed, created_at FROM users ORDER BY id DESC;'
    );
  },

  /**
   * Helper function to permanently remove a subscriber from both users and subscribers tables.
   */
  async deleteSubscriber(idOrEmail: number | string): Promise<void> {
    if (typeof idOrEmail === 'number') {
      const rows = await this.query<{ email: string }>(
        'SELECT email FROM users WHERE id = ?1;',
        [idOrEmail]
      );
      await this.execute('DELETE FROM users WHERE id = ?1;', [idOrEmail]);
      if (rows.length > 0 && rows[0]?.email) {
        await this.execute('DELETE FROM subscribers WHERE email = ?1;', [rows[0].email]);
      }
    } else {
      await this.execute('DELETE FROM users WHERE email = ?1;', [idOrEmail]);
      await this.execute('DELETE FROM subscribers WHERE email = ?1;', [idOrEmail]);
    }
  },
};
