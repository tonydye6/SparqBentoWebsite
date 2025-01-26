import { useState } from "react";

export function JoinUs({ expanded = false }) {
  if (!expanded) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-bold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Join the Sparq Uprising!</h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-4xl font-bold text-center">Join the Sparq Uprising!</h2>
    </div>
  );
}