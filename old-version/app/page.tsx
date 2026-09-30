"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import type { ImportedDataState } from "@excalidraw/excalidraw/data/types";

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    const WrappedExcalidraw = (
      props: React.ComponentProps<typeof mod.Excalidraw>,
    ) => (
      <mod.Excalidraw
        {...props}
        initialData={
          props.initialData ?? {
            appState: { theme: mod.THEME.DARK },
          }
        }
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

const DEBOUNCE_MS = 100;

function debounce<T extends (arg: string) => void>(
  fn: T,
  delay: number,
): (arg: string) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (arg: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(arg), delay);
  };
}

export default function App() {
  const [initialData, setInitialData] = useState<ImportedDataState | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    import("@/lib/db")
      .then(({ loadScene }) => loadScene())
      .then((json) => {
        if (json) {
          try {
            const parsed = JSON.parse(json) as ImportedDataState;
            if (
              parsed &&
              typeof parsed === "object" &&
              (parsed.elements === undefined || Array.isArray(parsed.elements))
            ) {
              setInitialData({
                ...parsed,
                appState: {
                  theme: "dark",
                  ...parsed.appState,
                },
              });
              return;
            }
          } catch {
            // Invalid or corrupted data
          }
        }
        setInitialData({ appState: { theme: "dark" } });
      })
      .catch(() => {
        setInitialData({ appState: { theme: "dark" } });
      })
      .finally(() => {
        setLoading(false);
        initialLoadDone.current = true;
      });
  }, []);

  const handleSave = useCallback(
    (json: string) => {
      if (!initialLoadDone.current) return;
      void (async () => {
        try {
          const { saveScene } = await import("@/lib/db");
          await saveScene(json);
        } catch (err) {
          console.error("Failed to save to IndexedDB:", err);
        }
      })();
    },
    [],
  );

  const debouncedSave = useRef(
    debounce((json: string) => handleSave(json), DEBOUNCE_MS),
  ).current;

  const handleChange = useCallback(
    (elements: readonly unknown[], appState: unknown, files: unknown) => {
      if (!initialLoadDone.current) return;
      void import("@excalidraw/excalidraw").then(({ serializeAsJSON }) => {
        const json = serializeAsJSON(
          elements as Parameters<typeof serializeAsJSON>[0],
          appState as Parameters<typeof serializeAsJSON>[1],
          files as Parameters<typeof serializeAsJSON>[2],
          "database",
        );
        debouncedSave(json);
      });
    },
    [debouncedSave],
  );

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e1e",
          color: "#ededed",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Excalidraw
        initialData={initialData ?? { appState: { theme: "dark" } }}
        onChange={handleChange}
      />
    </div>
  );
}
