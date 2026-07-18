import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

// Use unpooled connection for both app and seeds
// This is required for prepared statements and long-running operations
// Falls back to DATABASE_URL if DIRECT_URL or DATABASE_URL_UNPOOLED not set
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL

// For Better Auth (uses PG pool) and Drizzle ORM
// Using node-postgres directly with unpooled connection
export const pool = new Pool({
  connectionString,
  // Connection pool settings optimized for Neon serverless
  max: 5,                    // Limit connections for Neon
  min: 0,                    // Allow pool to shrink to 0
  idleTimeoutMillis: 30000,  // 30s idle timeout
  connectionTimeoutMillis: 60000, // 60s connection timeout for Neon wake-up
})

// Drizzle ORM with node-postgres (full transaction support)
export const db = drizzle(pool, { schema })