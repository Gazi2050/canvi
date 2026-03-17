"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { faker } from "@faker-js/faker";
import { PartySocket } from "partysocket";
import "@excalidraw/excalidraw/index.css";
import {
  LOCAL_STORAGE_KEYS,
  generateSessionId,
  generateUserIdentity,
  type ClientToServerMessage,
  type CollabUser,
  type CursorState,
  type SceneState,
  type ServerToClientMessage,
} from "@/lib/collab";
import { debounce, throttle } from "@/lib/throttle";
import { ShareModal } from "@/app/components/ShareModal";
import { UsersIndicator } from "@/app/components/UsersIndicator";

/** Strip collaborators from appState before updateScene. JSON turns Map into plain object, causing .forEach errors. We manage collaborators separately. */
function sanitizeSceneForUpdate(scene: SceneState): SceneState {
  if (!scene.appState || !("collaborators" in scene.appState)) return scene;
  const { collaborators: _collaborators, ...restAppState } = scene.appState;
  return { ...scene, appState: restAppState };
}

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    const WrappedExcalidraw = (
      props: React.ComponentProps<typeof mod.Excalidraw>,
    ) => (
      <mod.Excalidraw
        {...props}
        initialData={{
          appState: {
            theme: mod.THEME.DARK,
          },
        }}
      >
        <mod.MainMenu>
          <mod.MainMenu.DefaultItems.LoadScene />
          <mod.MainMenu.DefaultItems.SaveToActiveFile />
          <mod.MainMenu.DefaultItems.SaveAsImage />
          <mod.MainMenu.DefaultItems.Export />
          <mod.MainMenu.DefaultItems.ToggleTheme />
          <mod.MainMenu.DefaultItems.ChangeCanvasBackground />
        </mod.MainMenu>
      </mod.Excalidraw>
    );

    return { default: WrappedExcalidraw };
  },
  { ssr: false },
);

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

function buildShareUrl(roomId: string | null) {
  if (typeof window === "undefined" || !roomId) return null;
  const url = new URL(window.location.href);
  url.searchParams.set("roomId", roomId);
  return url.toString();
}

export default function App() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [user, setUser] = useState<CollabUser | null>(null);
  const [users, setUsers] = useState<CollabUser[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const apiRef = useRef<{ updateScene: (scene: unknown) => void } | null>(null);
  const socketRef = useRef<PartySocket | null>(null);
  const cursorsRef = useRef<Map<string, CursorState>>(new Map());
  const usersRef = useRef<CollabUser[]>([]);

  const shareUrl = useMemo(() => buildShareUrl(roomId), [roomId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromUrl = searchParams.get("roomId");
    const storedSessionId =
      window.localStorage.getItem(LOCAL_STORAGE_KEYS.sessionId);

    const initialRoomId = fromUrl ?? storedSessionId ?? null;
    if (initialRoomId && !roomId) {
      setRoomId(initialRoomId);
      if (fromUrl) {
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.sessionId, fromUrl);
      }
    }

    const storedUserId = window.localStorage.getItem(LOCAL_STORAGE_KEYS.userId);
    const storedUserName = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.userName,
    );
    const storedUserColor = window.localStorage.getItem(
      LOCAL_STORAGE_KEYS.userColor,
    );

    if (storedUserId && storedUserName && storedUserColor) {
      setUser({
        id: storedUserId,
        name: storedUserName,
        color: storedUserColor,
      });
    } else {
      const generated = generateUserIdentity(faker);
      setUser(generated);
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.userId, generated.id);
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.userName, generated.name);
      window.localStorage.setItem(
        LOCAL_STORAGE_KEYS.userColor,
        generated.color,
      );
    }
  }, [searchParams, roomId]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const updateCollaborators = useCallback(() => {
    if (!apiRef.current) return;

    const collaborators = new Map<
      string,
      {
        id: string;
        username: string;
        pointer: { x: number; y: number };
        background: string;
      }
    >();

    for (const user of usersRef.current) {
      const cursor = cursorsRef.current.get(user.id);
      if (!cursor) continue;

      collaborators.set(user.id, {
        id: user.id,
        username: user.name,
        pointer: { x: cursor.x, y: cursor.y },
        background: user.color,
      });
    }

    apiRef.current.updateScene({ collaborators });
  }, []);

  const connect = useCallback(
    (targetRoomId: string, currentUser: CollabUser) => {
      if (connectionStatus === "connected") return;

      setConnectionStatus("connecting");
      const socket = new PartySocket({
        host: process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? window.location.host,
        room: targetRoomId,
        party: "collab",
      });

      socketRef.current = socket;

      socket.onopen = () => {
        setConnectionStatus("connected");
        const joinMessage: ClientToServerMessage = {
          type: "join",
          roomId: targetRoomId,
          user: currentUser,
        };
        socket.send(JSON.stringify(joinMessage));
      };

      socket.onclose = () => {
        setConnectionStatus("idle");
      };

      socket.onerror = () => {
        setConnectionStatus("error");
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(
            event.data,
          ) as ServerToClientMessage | SceneState;

          if (!("type" in message)) {
            return;
          }

          if (message.type === "fullState") {
            usersRef.current = message.users;
            setUsers(message.users);
            if (apiRef.current && message.scene) {
              apiRef.current.updateScene(sanitizeSceneForUpdate(message.scene));
            }
            cursorsRef.current = new Map(
              message.cursors.map((cursor) => [cursor.userId, cursor]),
            );
            updateCollaborators();
          } else if (message.type === "users") {
            usersRef.current = message.users;
            setUsers(message.users);
            updateCollaborators();
          } else if (message.type === "sceneUpdate") {
            if (apiRef.current) {
              apiRef.current.updateScene(sanitizeSceneForUpdate(message.scene));
            }
          } else if (message.type === "cursorUpdate") {
            cursorsRef.current.set(message.cursor.userId, message.cursor);
            updateCollaborators();
          } else if (message.type === "sessionNotFound") {
            socketRef.current?.close();
            socketRef.current = null;
            setConnectionStatus("idle");
            setRoomId(null);
            setUsers([]);
            window.localStorage.removeItem(LOCAL_STORAGE_KEYS.sessionId);
            router.push("/");
            setToastMessage("Session expired or invalid. Create a new one.");
          }
        } catch {
          // ignore malformed messages
        }
      };
    },
    [connectionStatus, updateCollaborators, router],
  );

  const handleStartSession = useCallback(() => {
    if (!user) return;
    if (roomId) {
      // Room already exists; auto-connect effect will ensure connection.
      return;
    }

    const id = generateSessionId(user.name);
    setRoomId(id);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.sessionId, id);
      const url = new URL(window.location.href);
      url.searchParams.set("roomId", id);
      router.replace(url.toString(), { scroll: false });
    }

    connect(id, user);
  }, [connect, connectionStatus, roomId, router, user]);
 
  useEffect(() => {
    if (!roomId || !user) return;
    if (connectionStatus === "connected" || connectionStatus === "connecting") {
      return;
    }
    connect(roomId, user);
  }, [roomId, user, connectionStatus, connect]);

  const sendSceneUpdateRef = useRef<
    (elements: unknown, appState: unknown, files: unknown) => void
  >(() => {});
  const sendSceneUpdate = useCallback(
    (elements: unknown, appState: unknown, files: unknown) => {
      if (!socketRef.current || connectionStatus !== "connected" || !roomId) {
        return;
      }
      const scene = sanitizeSceneForUpdate({
        elements: elements as SceneState["elements"],
        appState: appState as SceneState["appState"],
        files: files as SceneState["files"],
      });
      const message: ClientToServerMessage = {
        type: "sceneUpdate",
        roomId,
        scene,
      };
      socketRef.current.send(JSON.stringify(message));
    },
    [connectionStatus, roomId],
  );
  useEffect(() => {
    sendSceneUpdateRef.current = sendSceneUpdate;
  }, [sendSceneUpdate]);

  const handleChange = useMemo(
    () =>
      debounce(
        (a: unknown, b: unknown, c: unknown) =>
          sendSceneUpdateRef.current(a, b, c),
        100,
      ),
    [],
  );

  const sendCursorUpdateRef = useRef<
    (payload: { pointer: { x: number; y: number } }) => void
  >(() => {});
  const sendCursorUpdate = useCallback(
    (payload: { pointer: { x: number; y: number } }) => {
      if (!socketRef.current || connectionStatus !== "connected" || !roomId) {
        return;
      }
      if (!user) return;
      const cursor: CursorState = {
        userId: user.id,
        x: payload.pointer.x,
        y: payload.pointer.y,
        lastUpdate: Date.now(),
      };
      const message: ClientToServerMessage = {
        type: "cursorUpdate",
        roomId,
        cursor,
      };
      socketRef.current.send(JSON.stringify(message));
    },
    [connectionStatus, roomId, user],
  );
  useEffect(() => {
    sendCursorUpdateRef.current = sendCursorUpdate;
  }, [sendCursorUpdate]);

  const handlePointerUpdate = useMemo(() => {
    const fn = (
      payload: { pointer: { x: number; y: number } },
    ): void => sendCursorUpdateRef.current(payload);
    return throttle(fn as (payload: unknown) => void, 100) as typeof fn;
  }, []);

  const isCollaborating = connectionStatus === "connected";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Excalidraw
        excalidrawAPI={(api) => {
          apiRef.current = api as { updateScene: (scene: unknown) => void };
        }}
        onChange={handleChange as (elements: unknown, appState: unknown, files: unknown) => void}
        onPointerUpdate={handlePointerUpdate as (payload: { pointer: { x: number; y: number } }) => void}
        renderTopRightUI={() => (
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="rounded bg-foreground px-3 py-1 text-xs font-semibold text-background"
          >
            Share
          </button>
        )}
      />
      <UsersIndicator users={users} />
      <ShareModal
        isOpen={isShareOpen}
        shareUrl={shareUrl}
        isCollaborating={isCollaborating}
        onStartSession={handleStartSession}
        onClose={() => setIsShareOpen(false)}
      />
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
