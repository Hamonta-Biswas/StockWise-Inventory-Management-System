import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schema } from './schema.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export function createDatabase({ filename } = {}) {
  const resolved = filename ?? path.resolve(here, '../../data/stockwise.sqlite');
  if (resolved !== ':memory:') fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const db = new Database(resolved);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  db.exec(schema);
  return db;
}
