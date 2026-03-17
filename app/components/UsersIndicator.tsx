"use client";

import React from "react";
import type { CollabUser } from "@/lib/collab";

type UsersIndicatorProps = {
  users: CollabUser[];
};

export const UsersIndicator: React.FC<UsersIndicatorProps> = ({ users }) => {
  if (!users.length) return null;

  const visible = users.slice(0, 3);
  const remaining = users.length - visible.length;

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-10 flex flex-col items-end gap-1 text-xs">
      <div className="pointer-events-auto rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white shadow">
        {users.length} user{users.length === 1 ? "" : "s"} connected
      </div>
      <div className="pointer-events-auto flex flex-wrap justify-end gap-1">
        {visible.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[11px] text-white shadow"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span>{user.name}</span>
          </div>
        ))}
        {remaining > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[11px] text-white shadow">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
};
