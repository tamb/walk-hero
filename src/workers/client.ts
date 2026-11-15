import * as Comlink from "comlink";

export type CityWorker = {
  getCityByGeoData: (geoData: GeolocationPosition) => Promise<unknown[]>;
};

export type MeasurementWorker = {
  distBetweenInCM: (start: GeolocationPosition, end: GeolocationPosition) => Promise<number>;
};

export function createCityWorker(): CityWorker {
  const worker = new Worker(new URL("./cities.worker.ts", import.meta.url), {
    type: "module",
  });
  return Comlink.wrap<CityWorker>(worker);
}

export function createMeasurementWorker(): MeasurementWorker {
  const worker = new Worker(new URL("./measurements.worker.ts", import.meta.url), {
    type: "module",
  });
  return Comlink.wrap<MeasurementWorker>(worker);
}
