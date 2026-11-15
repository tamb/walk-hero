import * as Comlink from "comlink";
import { getCityByGeoData } from "./cities";

Comlink.expose({ getCityByGeoData });
