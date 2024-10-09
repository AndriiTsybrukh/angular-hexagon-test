import { Component } from '@angular/core';
import { HexagonDataResourcesService } from '../../data-access/resources/hexagon-data/hexagon-data-resources.service';

@Component({
  selector: 'aht-hexagon-map',
  standalone: true,
  imports: [],
  templateUrl: './hexagon-map.component.html',
  styleUrl: './hexagon-map.component.scss',
})
export class HexagonMapComponent {
  constructor(
    private readonly hexagonDataResourcesService: HexagonDataResourcesService
  ) {
    this.hexagonDataResourcesService.getData().subscribe(console.log);
  }
}
