import { Connection, createPool, Pool, PoolConnection } from "mysql2/promise";

// Initialize connection pool
let connectionPool: Pool;

/**
 * Get a connection from the connection pool or create a new one if pool is not initialized.
 *
 * @returns A Promise resolving to a PoolConnection.
 */
export async function getConnection(): Promise<PoolConnection> {

    // If connection pool is not initialized, create a new one
    if (!connectionPool) {
        connectionPool = createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT as string),
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT as string),
        });
    }

    // Get a connection from the pool and return it
    const connection: PoolConnection = await connectionPool.getConnection();
    return connection;
}

/**
 * Execute a database query using the provided connection and return the result.
 *
 * @param connection - The database connection to use for executing the query.
 * @param query - The SQL query to execute.
 * @param values - Optional values to be used as parameters in the query.
 * @returns A Promise resolving to the result of the query.
 */
export async function queryDatabase<T = any>(
    connection: Connection,
    query: string,
    ...values: any[]
): Promise<T> {

    // Execute the query using the provided connection and values
    const queryResult: any = await connection.query(query, values);

    // Return the result of the query
    return queryResult[0] as T;
}