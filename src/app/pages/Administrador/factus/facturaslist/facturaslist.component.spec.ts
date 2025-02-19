import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaslistComponent } from './facturaslist.component';

describe('FacturaslistComponent', () => {
  let component: FacturaslistComponent;
  let fixture: ComponentFixture<FacturaslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
