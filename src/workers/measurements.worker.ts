import * as Comlink from "comlink";
import { distBetweenInCM, toFeet, toKm, toMeters, toMiles } from "./measurements";

Comlink.expose({
  distBetweenInCM,
  toFeet,
  toKm,
  toMeters,
  toMiles,
});
