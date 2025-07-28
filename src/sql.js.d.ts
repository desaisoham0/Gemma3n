declare module "sql.js" {
  export interface QueryResult {
    columns: string[];
    values: unknown[][];
  }

  export interface Database {
    run: (sql: string, params?: unknown[]) => void;
    exec: (sql: string) => QueryResult[];
    export: () => Uint8Array;
    // Add other methods as needed
  }

  const initSqlJs: (
    config?: unknown,
  ) => Promise<{ Database: { new (...args: unknown[]): Database } }>;
  export default initSqlJs;
  export { Database, QueryResult };
}
