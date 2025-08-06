// src/data/donauPoints.ts
import rawData from "./DONAUKILOMETER2OGD.json";

export type DonauPoint = {
  km: number;
  dist: number;
  rechts: string;
  links: string;
  coordinates: [number, number];
  abschnitt: number;
};

export const donauPoints: DonauPoint[] = rawData.features.map(
  (feature: any) => ({
    km: feature.properties.STATION,
    dist: feature.properties.STATION,
    rechts: "",
    links: "",
    coordinates: feature.geometry.coordinates,
    abschnitt: feature.properties.KURZRID,
  })
);
