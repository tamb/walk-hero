export type WakeLockResult = "granted" | "unavailable" | "failed";

type ScreenSentinel = {
  release: () => Promise<void>;
  addEventListener: (type: "release", listener: () => void) => void;
};

type WakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: "screen") => Promise<ScreenSentinel>;
  };
};

/**
 * Screen Wake Lock that stays on for a walk.
 * Browsers drop the lock whenever the page is hidden (screen off, app switch).
 * While the player still wants the screen locked, it is requested again as soon
 * as the page is visible.
 */
export function createScreenWakeLock() {
  let sentinel: ScreenSentinel | null = null;
  let desired = false;
  let disposed = false;

  const forget = (released: ScreenSentinel) => {
    if (sentinel === released) sentinel = null;
  };

  const acquire = async (): Promise<WakeLockResult> => {
    const nav = navigator as WakeLockNavigator;
    if (!nav.wakeLock) {
      console.info("no WakeLock");
      return "unavailable";
    }

    try {
      const next = await nav.wakeLock.request("screen");
      sentinel = next;
      next.addEventListener("release", () => forget(next));
      console.info("[WakeLock]: ON");
      return "granted";
    } catch (err) {
      const error = err as { name?: string; message?: string };
      console.info(`${error.name}, ${error.message}`);
      sentinel = null;
      return "failed";
    }
  };

  const onVisibility = () => {
    if (disposed) return;
    if (document.visibilityState === "visible" && desired && !sentinel) {
      void acquire();
    }
  };

  document.addEventListener("visibilitychange", onVisibility);

  return {
    async request(): Promise<WakeLockResult> {
      desired = true;
      const result = await acquire();
      if (result !== "granted") desired = false;
      return result;
    },

    async release() {
      desired = false;
      if (!sentinel) return;
      console.log("releasing...");
      const current = sentinel;
      try {
        await current.release();
      } finally {
        forget(current);
        console.info("[WakeLock]: OFF");
      }
    },

    dispose() {
      disposed = true;
      desired = false;
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}

export type ScreenWakeLock = ReturnType<typeof createScreenWakeLock>;
