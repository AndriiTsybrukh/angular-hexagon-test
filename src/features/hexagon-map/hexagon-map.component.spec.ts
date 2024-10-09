import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexagonMapComponent } from './hexagon-map.component';

describe('HexagonMapComponent', () => {
  let component: HexagonMapComponent;
  let fixture: ComponentFixture<HexagonMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexagonMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexagonMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
