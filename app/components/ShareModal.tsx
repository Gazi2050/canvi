"use client";

import React, { useState } from "react";

type ShareModalProps = {
  isOpen: boolean;
  shareUrl: string | null;
  isCollaborating: boolean;
  onStartSession: () => void;
  onClose: () => void;
};

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  shareUrl,
  isCollaborating,
  onStartSession,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg transition-all">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Share this whiteboard</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-foreground/70 hover:bg-foreground/10"
          >
            Close
          </button>
        </div>
        <p className="mb-4 text-sm text-foreground/70">
          Start a live session and share the link below so others can join this
          canvas in real time. Each link is unique to the current whiteboard.
        </p>
        <div className="mb-4 space-y-1">
          <span className="text-xs font-medium uppercase text-foreground/60">
            Share link
          </span>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={shareUrl ?? "Start a session to get a link"}
              className="flex-1 rounded border border-foreground/10 bg-foreground/5 px-3 py-2 text-xs text-foreground/90"
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={!shareUrl}
              className="whitespace-nowrap rounded bg-foreground px-3 py-2 text-xs font-medium text-background disabled:cursor-not-allowed disabled:bg-foreground/40"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onStartSession}
          disabled={isCollaborating}
          className="mt-2 w-full rounded bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:bg-foreground/40"
        >
          {isCollaborating ? "Session Active" : "Start Session"}
        </button>
      </div>
    </div>
  );
};
