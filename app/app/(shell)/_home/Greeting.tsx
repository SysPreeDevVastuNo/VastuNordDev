"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

function partOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

// Greets by the viewer's local time; the server render says "Hello" and the
// client swaps in the time of day after hydration.
export default function Greeting({ firstName }: { firstName: string }) {
  const greeting = useSyncExternalStore(noopSubscribe, partOfDay, () => "Hello");
  return (
    <h1 className="mt-3 text-[clamp(1.6rem,5vw,2.4rem)] leading-tight font-semibold text-white">
      {greeting}, {firstName}.
    </h1>
  );
}
