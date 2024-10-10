import { Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import {
  DATA_UPDATER_DEBOUNCE_TIME,
  HEXAGON_MAP_STORE_INIT,
  HexagonBoundaryInfo,
  HexagonMapStoreState,
} from './hexagon-map-store.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { GeoJsonResourcesService } from '../../data-access/resources/hexagon-data/geo-json-resources.service';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { HexagonGeoJsonProperties } from '../../data-access/resources/hexagon-data/geo-json.model';
import { GeoJsonConverterUtil } from '../../utils/geo-json-converter.util';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class HexagonMapStoreService
  extends ComponentStore<HexagonMapStoreState>
  implements OnStoreInit
{
  public readonly boundaries$: Observable<HexagonBoundaryInfo[]> = this.select(
    ({ boundaries }) => boundaries
  ).pipe(filter((boundaries) => boundaries.length > 0));

  public readonly setGeoJsonData: (
    geoJsonData: FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>
  ) => void = this.updater<
    FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>
  >((state, geoJsonData) => ({
    ...state,
    geoJsonData,
  }));

  public readonly setZoom: (zoom: number) => void = this.updater<number>(
    (state, zoom) => ({
      ...state,
      zoom,
    })
  );

  public readonly setBoundaries: (boundaries: HexagonBoundaryInfo[]) => void =
    this.updater<HexagonBoundaryInfo[]>((state, boundaries) => ({
      ...state,
      boundaries,
    }));

  private readonly loadGeoJsonData: () => void = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.geoJsonResourcesService.getGeoJsonData().pipe(
          tap((data) => {
            this.setGeoJsonData(data);
            this.forceUpdate();
          })
        )
      )
    )
  );

  private readonly maintainDataUpdate: () => void = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.forceUpdateTriggerSubject.pipe(
          debounceTime(DATA_UPDATER_DEBOUNCE_TIME)
        )
      ),
      concatLatestFrom(() => [
        this.select(({ zoom }) => zoom).pipe(distinctUntilChanged()),
        this.select(({ geoJsonData }) => geoJsonData),
      ]),
      tap(([, zoom, geoJsonData]) => {
        this.generateAndUpdateBoundaries({ geoJsonData, zoom });
      })
    )
  );

  private readonly generateAndUpdateBoundaries: ({
    geoJsonData,
    zoom,
  }: {
    geoJsonData: FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>;
    zoom: number;
  }) => void = this.effect<{
    geoJsonData: FeatureCollection<MultiPolygon, HexagonGeoJsonProperties>;
    zoom: number;
  }>((data$) =>
    data$.pipe(
      tap(({ geoJsonData, zoom }) => {
        const EPSG3857 = 'EPSG:3857';
        const EPSG4326 = 'EPSG:4326';

        const convertedGeoJson = GeoJsonConverterUtil.convertGeoJsonCoordinates(
          geoJsonData,
          EPSG3857,
          EPSG4326
        );

        const boundaries = GeoJsonConverterUtil.getH3Indexes(
          convertedGeoJson,
          this.getHexagonResolution(zoom)
        ).map((hexagon) => GeoJsonConverterUtil.getHexagonBoundaries(hexagon));

        this.setBoundaries(
          boundaries.map((coordinates, index) => ({
            coordinates,
            color: geoJsonData.features[index].properties.COLOR_HEX,
          }))
        );
      })
    )
  );

  private readonly forceUpdateTriggerSubject: Subject<void> =
    new Subject<void>();

  constructor(
    private readonly geoJsonResourcesService: GeoJsonResourcesService
  ) {
    super(HEXAGON_MAP_STORE_INIT);
  }

  public ngrxOnStoreInit(): void {
    this.maintainDataUpdate();
    this.loadGeoJsonData();
  }

  public forceUpdate(): void {
    this.forceUpdateTriggerSubject.next();
  }

  private getHexagonResolution(zoom: number): number {
    const min = 2;
    const max = 6;
    return Math.max(Math.min(zoom - 3, Math.max(min, max)), Math.min(min, max));
  }
}
