/// <reference types="vite/client" />

declare module "prop-types" {
  const PropTypes: any;
  export default PropTypes;
}

declare module "random-int" {
  export default function randomInteger(min: number, max: number): number;
}

declare module "tocada";

interface WakeLockSentinel extends EventTarget {
  released: boolean;
  type: "screen";
  release: () => Promise<void>;
}

interface WakeLock {
  request: (type: "screen") => Promise<WakeLockSentinel>;
}

interface Navigator {
  wakeLock?: WakeLock;
}
