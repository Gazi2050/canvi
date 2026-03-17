import type * as Party from "partykit/server";
import type {
  ClientToServerMessage,
  CollabUser,
  CursorState,
  SceneState,
  ServerToClientMessage,
} from "@/lib/collab";

/** Room IDs that were destroyed when all users left. Joining these redirects to home. */
const destroyedRooms = new Set<string>();

/** Serializable state for storage - use Records instead of Maps for JSON compatibility */
type StoredRoomState = {
  scene: SceneState | null;
  users: Record<string, CollabUser>;
  cursors: Record<string, CursorState>;
};

const getRoomState = async (room: Party.Room): Promise<StoredRoomState> => {
  let state = await room.storage.get<StoredRoomState>("state");
  if (!state) {
    state = {
      scene: null,
      users: {},
      cursors: {},
    };
    await room.storage.put("state", state);
  }
  return state;
};

export default class CollabServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(connection: Party.Connection) {
    try {
      if (destroyedRooms.has(this.room.id)) {
        destroyedRooms.delete(this.room.id);
        const sessionNotFound: ServerToClientMessage = {
          type: "sessionNotFound",
        };
        connection.send(JSON.stringify(sessionNotFound));
        return;
      }
      const state = await getRoomState(this.room);
      const fullState: ServerToClientMessage = {
        type: "fullState",
        scene: state.scene,
        users: Object.values(state.users),
        cursors: Object.values(state.cursors),
      };
      connection.send(JSON.stringify(fullState));
    } catch (err) {
      console.error("[collab] onConnect error:", err);
      try {
        const error: ServerToClientMessage = {
          type: "error",
          message: "Connection failed",
        };
        connection.send(JSON.stringify(error));
      } catch {
        // Connection may already be closed
      }
    }
  }

  async onMessage(message: string, connection: Party.Connection) {
    let parsed: ClientToServerMessage;
    try {
      parsed = JSON.parse(message) as ClientToServerMessage;
    } catch {
      const error: ServerToClientMessage = {
        type: "error",
        message: "Invalid message",
      };
      connection.send(JSON.stringify(error));
      return;
    }

    try {
      const state = await getRoomState(this.room);

      if (parsed.type === "join") {
        if (destroyedRooms.has(this.room.id)) {
          destroyedRooms.delete(this.room.id);
          const sessionNotFound: ServerToClientMessage = {
            type: "sessionNotFound",
          };
          connection.send(JSON.stringify(sessionNotFound));
          return;
        }
        state.users[connection.id] = parsed.user;
        await this.room.storage.put("state", state);
        const usersMessage: ServerToClientMessage = {
          type: "users",
          users: Object.values(state.users),
        };
        this.room.broadcast(JSON.stringify(usersMessage));
        return;
      }

      if (parsed.type === "sceneUpdate") {
        state.scene = parsed.scene;
        await this.room.storage.put("state", state);
        const update: ServerToClientMessage = {
          type: "sceneUpdate",
          roomId: parsed.roomId,
          scene: parsed.scene,
        };
        this.room.broadcast(JSON.stringify(update), [connection.id]);
        return;
      }

      if (parsed.type === "cursorUpdate") {
        const cursor = parsed.cursor;
        state.cursors[cursor.userId] = cursor;
        await this.room.storage.put("state", state);
        const cursorMessage: ServerToClientMessage = {
          type: "cursorUpdate",
          roomId: parsed.roomId,
          cursor,
        };
        this.room.broadcast(JSON.stringify(cursorMessage), [connection.id]);
        return;
      }
    } catch (err) {
      console.error("[collab] onMessage error:", err);
      try {
        const error: ServerToClientMessage = {
          type: "error",
          message: "Processing failed",
        };
        connection.send(JSON.stringify(error));
      } catch {
        // Connection may already be closed
      }
    }
  }

  async onClose(connection: Party.Connection) {
    try {
      const state = await getRoomState(this.room);
      const user = state.users[connection.id];
      delete state.users[connection.id];
      if (user) delete state.cursors[user.id];

      if (Object.keys(state.users).length === 0) {
        state.scene = null;
        state.cursors = {};
        destroyedRooms.add(this.room.id);
        await this.room.storage.put("state", state);
      } else {
        await this.room.storage.put("state", state);
        const usersMessage: ServerToClientMessage = {
          type: "users",
          users: Object.values(state.users),
        };
        this.room.broadcast(JSON.stringify(usersMessage));
      }
    } catch (err) {
      console.error("[collab] onClose error:", err);
      // Do not rethrow - prevents workerd disconnect crashes
    }
  }
}
