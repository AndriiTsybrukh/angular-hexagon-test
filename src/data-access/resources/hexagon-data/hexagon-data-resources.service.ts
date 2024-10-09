import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import data from '../../mocks/data.json';
import { Hexagon } from './hexagon-data.model';

@Injectable({ providedIn: 'root' })
export class HexagonDataResourcesService {
  public getData(): Observable<Hexagon> {
    return of(data as Hexagon);
  }
}
