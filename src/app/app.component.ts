import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HexagonMapComponent } from '../features/hexagon-map/hexagon-map.component';

@Component({
  selector: 'aht-root',
  standalone: true,
  imports: [RouterOutlet, HexagonMapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-hexagon-test';
}
