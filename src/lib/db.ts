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
};
