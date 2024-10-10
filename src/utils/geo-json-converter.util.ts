import { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import proj4 from 'proj4';
import geojson2h3 from 'geojson2h3';
import { HexagonGeoJsonProperties } from '../data-access/resources/hexagon-data/geo-json.model';
import { cellToBoundary, CoordPair } from 'h3-js';

export namespace GeoJsonConverterUtil {
  export const convertGeoJsonCoordinates = (
    geoJson: FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>,
    fromSystem: string,
    toSystem: string
  ): FeatureCollection<MultiPolygon, HexagonGeoJsonProperties> => ({
    ...geoJson,
    features: geoJson.features.map(
      (feature: Feature<MultiPolygon, HexagonGeoJsonProperties>) => ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: feature.geometry.coordinates.map(
            (polygon: number[][][]) =>
              polygon.map((ring: number[][]) =>
                ring.map((coord: number[]) =>
                  proj4(fromSystem, toSystem, coord)
                )
              )
          ),
        },
      })
    ),
  });

  export const getH3Indexes = (
    geoJson: FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>,
    resolution: number
  ): string[][] =>
    geoJson.features.map((feature) =>
      geojson2h3.featureToH3Set(feature, resolution, { ensureOutput: true })
    );

  export const getHexagonBoundaries = (hexagons: string[]): CoordPair[][] =>
    hexagons.map((hexagon) => cellToBoundary(hexagon));
}
