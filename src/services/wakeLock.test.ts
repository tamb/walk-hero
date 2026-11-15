import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { createScreenWakeLock } from "./wakeLock";

type FakeSentinel = {
  release: ReturnType<typeof vi.fn>;
  addEventListener: (type: "release", listener: () => void) => void;
  fireRelease: () => void;
};

function installWakeLock() {
  const sentinels: FakeSentinel[] = [];
  const request = vi.fn(async () => {
    const listeners = new Set<() => void>();
    const sentinel: FakeSentinel = {
      release: vi.fn(async () => {
        listeners.forEach((listener) => listener());
      }),
      addEventListener(_type, listener) {
        listeners.add(listener);
      },
      fireRelease() {
        listeners.forEach((listener) => listener());
      },
    };
    sentinels.push(sentinel);
    return sentinel;
  });

  Object.defineProperty(navigator, "wakeLock", {
    configurable: true,
    value: { request },
  });

  return { request, sentinels };
}

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "wakeLock");
  setVisibility("visible");
});

describe("screen wake lock", () => {
  it("requests a screen lock", async () => {
    const { request } = installWakeLock();
    const wakeLock = createScreenWakeLock();

    await expect(wakeLock.request()).resolves.toBe("granted");
    expect(request).toHaveBeenCalledWith("screen");
    wakeLock.dispose();
  });

  it("reports that the browser has no wake lock", async () => {
    const wakeLock = createScreenWakeLock();
    await expect(wakeLock.request()).resolves.toBe("unavailable");
    wakeLock.dispose();
  });

  it("reports a failed request without keeping the lock desired", async () => {
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: {
        request: vi.fn(async () => {
          throw Object.assign(new Error("low battery"), { name: "NotAllowedError" });
        }),
      },
    });
    const wakeLock = createScreenWakeLock();
    await expect(wakeLock.request()).resolves.toBe("failed");

    setVisibility("hidden");
    setVisibility("visible");
    expect(navigator.wakeLock?.request).toHaveBeenCalledTimes(1);
    wakeLock.dispose();
  });

  it("releases the lock when the player unlocks", async () => {
    const { sentinels } = installWakeLock();
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const wakeLock = createScreenWakeLock();

    await wakeLock.request();
    await wakeLock.release();

    expect(sentinels[0].release).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledWith("releasing...");
    expect(info).toHaveBeenCalledWith("[WakeLock]: OFF");

    setVisibility("hidden");
    setVisibility("visible");
    expect(sentinels).toHaveLength(1);
    wakeLock.dispose();
    info.mockRestore();
    log.mockRestore();
  });

  it("asks for the lock again after the browser releases it while the page was hidden", async () => {
    const { request, sentinels } = installWakeLock();
    const wakeLock = createScreenWakeLock();
    await wakeLock.request();

    sentinels[0].fireRelease();
    setVisibility("hidden");
    setVisibility("visible");

    expect(request).toHaveBeenCalledTimes(2);
    wakeLock.dispose();
  });
});
