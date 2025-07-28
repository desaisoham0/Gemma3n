import initSqlJs from "sql.js";
import type { Database } from "sql.js";

let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;

// Lazy‑load the SQL.js module and hydrate from localStorage if present
export async function getDatabase(): Promise<Database> {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: () => `/sql-wasm.wasm`,
    });
  }

  const saved = localStorage.getItem("chat-db");
  if (saved) {
    try {
      const bytes = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0));
      return new SQL.Database(bytes);
    } catch (error) {
      console.error("Error loading saved database:", error);
      // If there's an error loading the saved DB, create a new one
      localStorage.removeItem("chat-db");
      return new SQL.Database();
    }
  }

  return new SQL.Database();
}

// Ensure the chats and messages tables exist, then persist initial state
export async function initChatTables(): Promise<Database> {
  const db = await getDatabase();

  try {
    // Create chats table
    db.run(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Create messages table with chat_id foreign key
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        ts INTEGER NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
    `);

    // Create indexes for better performance
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages (chat_id);`,
    );
    db.run(`CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages (ts);`);
    db.run(
      `CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats (updated_at);`,
    );

    persist(db);
    return db;
  } catch (error) {
    console.error("Error initializing chat tables:", error);
    throw error;
  }
}

// Serialize the DB and stash it as a Base64 string
export function persist(db: Database) {
  try {
    const data = db.export();
    const b64 = btoa(String.fromCharCode(...data));
    localStorage.setItem("chat-db", b64);
  } catch (error) {
    console.error("Error persisting database:", error);
  }
}

// Chat functions
export function createChat(db: Database, id: string, title: string) {
  if (!id || !title) {
    throw new Error("Chat ID and title are required");
  }

  const now = Date.now();
  try {
    db.run(
      `INSERT INTO chats (id, title, created_at, updated_at) VALUES (?, ?, ?, ?);`,
      [id, title, now, now],
    );
    persist(db);
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export function updateChatTimestamp(db: Database, id: string) {
  if (!id) {
    throw new Error("Chat ID is required");
  }

  const now = Date.now();
  try {
    db.run(`UPDATE chats SET updated_at = ? WHERE id = ?;`, [now, id]);
    persist(db);
  } catch (error) {
    console.error("Error updating chat timestamp:", error);
    throw error;
  }
}

export function updateChatTitle(db: Database, id: string, title: string) {
  if (!id || !title) {
    throw new Error("Chat ID and title are required");
  }

  try {
    db.run(`UPDATE chats SET title = ?, updated_at = ? WHERE id = ?;`, [
      title,
      Date.now(),
      id,
    ]);
    persist(db);
  } catch (error) {
    console.error("Error updating chat title:", error);
    throw error;
  }
}

export function getAllChats(db: Database) {
  try {
    const res = db.exec(`
      SELECT id, title, created_at, updated_at 
      FROM chats 
      ORDER BY updated_at DESC;
    `);

    if (!res[0]) return [];

    const { columns, values } = res[0];
    return values.map((row: unknown[]) => {
      const obj: Record<string, unknown> = {};
      row.forEach((value, index) => {
        obj[columns[index]] = value;
      });
      return {
        id: obj.id as string,
        title: obj.title as string,
        created_at: obj.created_at as number,
        updated_at: obj.updated_at as number,
      };
    });
  } catch (error) {
    console.error("Error getting all chats:", error);
    return [];
  }
}

export function getChatById(db: Database, id: string) {
  if (!id) {
    throw new Error("Chat ID is required");
  }

  try {
    const res = db.exec(
      `SELECT id, title, created_at, updated_at FROM chats WHERE id = ?;`,
      [id],
    );

    if (!res[0] || res[0].values.length === 0) return null;

    const { columns, values } = res[0];
    const row = values[0];
    const obj: Record<string, unknown> = {};
    row.forEach((value, index) => {
      obj[columns[index]] = value;
    });

    return {
      id: obj.id as string,
      title: obj.title as string,
      created_at: obj.created_at as number,
      updated_at: obj.updated_at as number,
    };
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    return null;
  }
}

// Message functions
export function addMessage(
  db: Database,
  chatId: string,
  role: string,
  content: string,
) {
  if (!chatId || !role || !content) {
    throw new Error("Chat ID, role, and content are required");
  }

  if (!["user", "assistant", "system"].includes(role)) {
    throw new Error("Invalid role. Must be user, assistant, or system");
  }

  const ts = Date.now();
  try {
    db.run(
      `INSERT INTO messages (chat_id, role, content, ts) VALUES (?, ?, ?, ?);`,
      [chatId, role, content, ts],
    );
    // Update chat's updated_at timestamp
    updateChatTimestamp(db, chatId);
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

export function getMessages(db: Database, chatId: string) {
  if (!chatId) {
    throw new Error("Chat ID is required");
  }

  try {
    const res = db.exec(
      `SELECT id, role, content, ts FROM messages WHERE chat_id = ? ORDER BY ts ASC;`,
      [chatId],
    );

    if (!res[0]) return [];

    const { columns, values } = res[0];
    return values.map((row: unknown[]) => {
      const obj: Record<string, unknown> = {};
      row.forEach((value, index) => {
        obj[columns[index]] = value;
      });
      return {
        id: obj.id as number,
        role: obj.role as string,
        content: obj.content as string,
        ts: obj.ts as number,
      };
    });
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
}

export function deleteChat(db: Database, chatId: string) {
  if (!chatId) {
    throw new Error("Chat ID is required");
  }

  try {
    // Delete messages first (due to foreign key constraint)
    db.run("DELETE FROM messages WHERE chat_id = ?", [chatId]);
    // Then delete the chat
    db.run("DELETE FROM chats WHERE id = ?", [chatId]);
    persist(db);
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}
