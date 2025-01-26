import { useState } from "react";

export function JoinUs({ expanded = false }) {
  if (!expanded) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
    </div>
  );
}