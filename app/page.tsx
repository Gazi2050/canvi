"use client";

import React from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

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
          {/* Recreate default menu, but leave out social links */}
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

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Excalidraw />
    </div>
  );
}