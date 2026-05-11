import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { Pool } = pg;

// Connect to Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Connected to Supabase PostgreSQL DB");
});

// Helper to convert SQLite '?' to PostgreSQL '$1, $2'
const convertQuery = (query) => {
  let i = 1;
  return query.replace(/\?/g, () => `$${i++}`);
};

export const dbQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const pgQuery = convertQuery(query);
    const res = await client.query(pgQuery, params);
    return res.rows;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

export const dbRun = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const pgQuery = convertQuery(query);
    const res = await client.query(pgQuery, params);
    return {
      lastID: res.rows.length > 0 ? res.rows[0].id : null,
      changes: res.rowCount,
    };
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

const initDb = async () => {
  try {
    await dbRun(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT, 
      email TEXT UNIQUE NOT NULL,
      mobile TEXT UNIQUE,
      password TEXT,
      role TEXT CHECK(role IN ('admin', 'owner', 'tenant')) NOT NULL,
      google_id TEXT,
      address TEXT,
      occupation TEXT,
      documents TEXT, 
      is_approved BOOLEAN DEFAULT TRUE, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT,
      rent NUMERIC NOT NULL,
      size TEXT,
      furnishing TEXT,
      photos TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      availability TEXT DEFAULT 'available' CHECK(availability IN ('available', 'rented')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
      review TEXT,
      photos TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(property_id, tenant_id) 
    )`);

    await dbRun(`CREATE TABLE IF NOT EXISTS saved_properties (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, property_id) 
    )`);

    console.log("Supabase Database tables verified/initialized.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

initDb();

export default pool;

// !used sql lite so i am replacing it with supabase because the render does not allow sql in free tier
// import sqlite3 from "sqlite3";
// import path from "path";
// import { fileURLToPath } from "url";

// // Recreate __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize sqlite3 with verbose logging
// const sqlite = sqlite3.verbose();

// // Resolve the path to the database file
// const dbPath = path.resolve(__dirname, "../database.sqlite");

// const db = new sqlite.Database(dbPath, (err) => {
//   if (err) {
//     console.error("DB Error:", err.message);
//   } else {
//     console.log("Connected to SQLite DB");
//     initDb();
//   }
// });

// export const dbQuery = (query, params = []) => {
//   return new Promise((resolve, reject) => {
//     db.all(query, params, (err, rows) => {
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });
// };

// export const dbRun = (query, params = []) => {
//   return new Promise((resolve, reject) => {
//     db.run(query, params, function (err) {
//       if (err) reject(err);
//       else resolve(this);
//     });
//   });
// };

// const initDb = async () => {
//   try {
//     await dbRun(`CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT,
//       email TEXT UNIQUE NOT NULL,
//       mobile TEXT UNIQUE,
//       password TEXT,
//       role TEXT CHECK(role IN ('admin', 'owner', 'tenant')) NOT NULL,
//       google_id TEXT,
//       address TEXT,
//       occupation TEXT,
//       documents TEXT,
//       is_approved BOOLEAN DEFAULT 1,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )`);

//     await dbRun(`CREATE TABLE IF NOT EXISTS properties (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//       title TEXT NOT NULL,
//       location TEXT NOT NULL,
//       type TEXT,
//       rent REAL NOT NULL,
//       size TEXT,
//       furnishing TEXT,
//       photos TEXT,
//       status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
//       availability TEXT DEFAULT 'available' CHECK(availability IN ('available', 'rented')),
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )`);

//     await dbRun(`CREATE TABLE IF NOT EXISTS ratings (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
//       tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//       rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
//       review TEXT,
//       photos TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       UNIQUE(property_id, tenant_id)
//     )`);

//     await dbRun(`CREATE TABLE IF NOT EXISTS saved_properties (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//       property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       UNIQUE(user_id, property_id)
//     )`);

//     console.log("Enhanced Database tables verified/initialized.");
//   } catch (err) {
//     console.error("Error creating tables:", err);
//   }
// };

// export default db;
