import { CoordPair } from 'h3-js';
import { INIT_ZOOM } from './hexagon-map.model';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { HexagonGeoJsonProperties } from '../../data-access/resources/hexagon-data/geo-json.model';

export interface HexagonMapStoreState {
  zoom: number;
  boundaries: HexagonBoundaryInfo[];
  geoJsonData?: FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>;
}

export interface HexagonBoundaryInfo {
  coordinates: CoordPair[][];
  color: string;
}

export const HEXAGON_MAP_STORE_INIT: HexagonMapStoreState = {
  zoom: INIT_ZOOM,
  boundaries: [],
};

export const DATA_UPDATER_DEBOUNCE_TIME: number = 1e3;
