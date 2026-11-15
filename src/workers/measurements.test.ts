import { describe, expect, it } from "vite-plus/test";
import { distBetweenInCM, toFeet, toKm, toMeters, toMiles } from "./measurements";
import { position } from "../test/position";

describe("measurements", () => {
  it("converts centimeters into the units shown on the scorecard", () => {
    expect(toFeet(30.48)).toBeCloseTo(1);
    expect(toMeters(100)).toBeCloseTo(1);
    expect(toKm(100_000)).toBeCloseTo(1);
    expect(toMiles(160_934.4)).toBeCloseTo(1);
  });

  it("measures a longer walk as a larger distance", () => {
    const start = position(40, -73);
    const nearby = distBetweenInCM(start, position(40.01, -73));
    const farther = distBetweenInCM(start, position(41, -73));
    expect(nearby).toBeGreaterThan(0);
    expect(farther).toBeGreaterThan(nearby);
  });
});
