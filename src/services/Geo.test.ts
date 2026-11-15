import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { cloneGeoData, getStartingPoint, killPoll, startPoll, toLatLong, toTime } from "./Geo";
import { position } from "../test/position";

afterEach(() => {
  vi.mocked(navigator.geolocation.getCurrentPosition).mockReset();
  vi.mocked(navigator.geolocation.watchPosition).mockReset();
  vi.mocked(navigator.geolocation.clearWatch).mockReset();
});

describe("Geo", () => {
  it("reads latitude and longitude", () => {
    expect(toLatLong(position(42.46, 1.49))).toEqual([42.46, 1.49]);
  });

  it("returns undefined when the position cannot be read", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(toLatLong(undefined as unknown as GeolocationPosition)).toBeUndefined();
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it("formats a timestamp", () => {
    const formatted = toTime(position(0, 0));
    expect(typeof formatted).toBe("string");
    expect(formatted?.length).toBeGreaterThan(0);
  });

  it("copies coordinates instead of sharing the object", () => {
    const original = position(10, 20);
    const copy = cloneGeoData(original);
    expect(copy).toEqual({
      timestamp: original.timestamp,
      coords: {
        latitude: 10,
        longitude: 20,
        altitude: null,
        accuracy: 5,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    });
    expect(copy?.coords).not.toBe(original.coords);
  });

  it("asks for the current position once", () => {
    const success = vi.fn();
    getStartingPoint(success);
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(success);
  });

  it("watches the position with high accuracy and can stop", () => {
    const success = vi.fn();
    vi.mocked(navigator.geolocation.watchPosition).mockReturnValue(7);
    const watchId = startPoll(success);
    expect(navigator.geolocation.watchPosition).toHaveBeenCalledWith(success, undefined, {
      enableHighAccuracy: true,
      timeout: 1000,
    });
    killPoll(watchId);
    expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(7);
  });
});
