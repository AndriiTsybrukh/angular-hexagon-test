import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import data from '../../mocks/data.json';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { HexagonGeoJsonProperties } from './geo-json.model';

@Injectable({ providedIn: 'root' })
export class GeoJsonResourcesService {
  public getGeoJsonData(): Observable<
    FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>
  > {
    return of(
      data as FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>
    );
  }
}
