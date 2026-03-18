import Dexie, { type Table } from "dexie";

const SCHEMA_VERSION = 1;
const DEFAULT_DOC_ID = "default";

export interface SceneDocument {
  id: string;
  data: string; // JSON string from Excalidraw serializeAsJSON
  updatedAt: number;
  schemaVersion: number;
}

class FreespaceDB extends Dexie {
  documents!: Table<SceneDocument, string>;

  constructor() {
    super("freespace-db");
    this.version(SCHEMA_VERSION).stores({
      documents: "id",
    });
  }
}

let db: FreespaceDB | null = null;

function getDb(): FreespaceDB {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!db) {
    db = new FreespaceDB();
  }
  return db;
}

export async function loadScene(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const database = getDb();
  const doc = await database.documents.get(DEFAULT_DOC_ID);
  if (!doc) return null;
  return doc.data;
}

export async function saveScene(jsonData: string): Promise<void> {
  if (typeof window === "undefined") return;
  const database = getDb();
  await database.documents.put({
    id: DEFAULT_DOC_ID,
    data: jsonData,
    updatedAt: Date.now(),
    schemaVersion: SCHEMA_VERSION,
  });
}
