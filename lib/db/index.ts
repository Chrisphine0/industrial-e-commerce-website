import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { Pool } from 'pg'
import * as schema from './schema'

// For Better Auth (uses PG pool)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// For Drizzle ORM queries - fetchConnectionCache is now always true by default
export const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```
