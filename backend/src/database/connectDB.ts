// backend/src/dataBase/connectDB.ts
import Database from 'better-sqlite3';

const db = new Database('database/plants.db', { verbose: console.log });
console.log('Database connection established');

export default db;