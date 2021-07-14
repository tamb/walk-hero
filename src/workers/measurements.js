import distFrom from "distance-from";

// eslint-disable-next-line
import { toLatLong } from "../services/Geo"; // eslint-disable-line

export function toFeet(cm) {
  return cm / 30.48;
}

export function toMiles(cm) {
  return toFeet(cm) / 5280;
}

export function toKm(cm) {
  return toMeters(cm) / 1000;
}

export function toMeters(cm) {
  return cm / 100;
}

export function distBetweenInCM(start, end) {
  return distFrom(toLatLong(start)).to(toLatLong(end)).in("cm");
}
