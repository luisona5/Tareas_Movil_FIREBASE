import * as SQLite from "expo-sqlite";

// paso 2 
// Configura y exporta la base de datos SQLite
let intance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (intance) return intance;
    const db = await SQLite.openDatabaseAsync("todos.db");
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            createdAt TEXT NOT NULL
        );
    `);
    intance = db;
    return db;
}