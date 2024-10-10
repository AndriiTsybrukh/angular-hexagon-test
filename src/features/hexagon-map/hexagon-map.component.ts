import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { MAP_DEFAULT_OPTIONS } from './hexagon-map.model';
import {
  FeatureGroup,
  featureGroup,
  LeafletEvent,
  Map,
  Polygon,
  polygon,
} from 'leaflet';
import { provideComponentStore } from '@ngrx/component-store';
import { HexagonMapStoreService } from './hexagon-map-store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { HexagonBoundaryInfo } from './hexagon-map-store.model';

@UntilDestroy()
@Component({
  selector: 'aht-hexagon-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  providers: [provideComponentStore(HexagonMapStoreService)],
  templateUrl: './hexagon-map.component.html',
  styleUrl: './hexagon-map.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HexagonMapComponent {
  public readonly boundaries$: Observable<HexagonBoundaryInfo[]>;
  public readonly options = MAP_DEFAULT_OPTIONS;

  private featureGroup: FeatureGroup = null;

  constructor(private readonly storeService: HexagonMapStoreService) {
    this.boundaries$ = this.storeService.boundaries$;
  }

  public onMapReady(mapRef: Map): void {
    this.storeService.boundaries$
      .pipe(untilDestroyed(this))
      .subscribe((boundaries) => {
        this.featureGroup?.remove();
        const hexagons: Polygon[] = [];

        boundaries.forEach((boundary) => {
          const mapBounds = mapRef.getBounds();
          boundary.coordinates.forEach((coords) => {
            const polygonLayer = polygon(coords, {
              weight: 1,
              stroke: true,
              color: '#000',
              fillOpacity: 0.2,
              fillColor: `#${boundary.color}`,
            });

            if (mapBounds.overlaps(polygonLayer.getBounds())) {
              hexagons.push(polygonLayer);
              polygonLayer.addTo(mapRef);
            }
          });
        });

        this.featureGroup = featureGroup(hexagons);
        this.featureGroup.addTo(mapRef);
      });
  }

  public onMapMove(event: LeafletEvent): void {
    this.storeService.setZoom(event.target.getZoom());
    this.storeService.forceUpdate();
  }
}
