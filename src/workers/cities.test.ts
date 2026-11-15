import { describe, expect, it } from "vite-plus/test";
import { getCityByGeoData } from "./cities";
import { position } from "../test/position";

describe("getCityByGeoData", () => {
  it("finds a city within a hundredth of a degree", () => {
    const matches = getCityByGeoData(position(42.46372, 1.49129));
    expect(matches.map((city) => (city as { name: string }).name)).toContain("Sant Julià de Lòria");
  });

  it("returns no city from the middle of the ocean", () => {
    expect(getCityByGeoData(position(0, -30))).toEqual([]);
  });
});
