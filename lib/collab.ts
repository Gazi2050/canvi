import type { Faker } from "@faker-js/faker";

// Use minimal structural types to avoid depending on internal Excalidraw type paths
export type ExcalidrawElementLike = {
  id: string;
  type: string;
  [key: string]: unknown;
};

export type AppStateLike = {
  [key: string]: unknown;
};

export type CollabUser = {
  id: string;
  name: string;
  color: string;
};

export type CursorState = {
  userId: string;
  x: number;
  y: number;
  lastUpdate: number;
};

export type SceneState = {
  elements: readonly ExcalidrawElementLike[];
  appState: AppStateLike;
  files: Record<string, unknown>;
};

export type JoinMessage = {
  type: "join";
  roomId: string;
  user: CollabUser;
};

export type SceneUpdateMessage = {
  type: "sceneUpdate";
  roomId: string;
  scene: SceneState;
};

export type CursorUpdateMessage = {
  type: "cursorUpdate";
  roomId: string;
  cursor: CursorState;
};

export type FullStateMessage = {
  type: "fullState";
  scene: SceneState | null;
  users: CollabUser[];
  cursors: CursorState[];
};

export type UsersMessage = {
  type: "users";
  users: CollabUser[];
};

export type ErrorMessage = {
  type: "error";
  message: string;
};

export type SessionNotFoundMessage = {
  type: "sessionNotFound";
};

export type ServerToClientMessage =
  | FullStateMessage
  | UsersMessage
  | SceneUpdateMessage
  | CursorUpdateMessage
  | ErrorMessage
  | SessionNotFoundMessage;

export type ClientToServerMessage =
  | JoinMessage
  | SceneUpdateMessage
  | CursorUpdateMessage;

export const LOCAL_STORAGE_KEYS = {
  sessionId: "freespace.sessionId",
  userId: "freespace.userId",
  userName: "freespace.userName",
  userColor: "freespace.userColor",
} as const;

const randomPastelHue = () => Math.floor(Math.random() * 360);

export const generateColor = () => {
  const hue = randomPastelHue();
  const saturation = 80;
  const lightness = 70;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

export const generateSessionId = (name: string) => {
  const timestamp = Date.now();
  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return `session-${safeName || "guest"}-${timestamp}`;
};

export const generateUserIdentity = (faker: Faker): CollabUser => {
  const first = faker.person.firstName().toLowerCase();
  const last = faker.person.lastName().toLowerCase();
  const name = `${first} ${last}`;

  return {
    id: crypto.randomUUID(),
    name,
    color: generateColor(),
  };
};


