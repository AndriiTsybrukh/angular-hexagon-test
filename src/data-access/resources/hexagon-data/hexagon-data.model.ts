export interface Hexagon {
  type: string;
  features: HexagonFeatures[];
}

export interface HexagonFeatures {
  type: string;
  properties: HexagonProperties;
  geometry: HexagonGeometry;
}

export interface HexagonProperties {
  ID: number;
  COLOR_HEX: string;
}

interface HexagonGeometry {
  coordinates: number[][][][];
  type: string;
  crs: HexagonGeometryCrs;
}

interface HexagonGeometryCrs {
  properties: HexagonGeometryProperties;
  type: string;
}

interface HexagonGeometryProperties {
  name: string;
}
