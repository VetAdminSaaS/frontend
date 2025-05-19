import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarMesaComponent } from './asignar-mesa.component';

describe('AsignarMesaComponent', () => {
  let component: AsignarMesaComponent;
  let fixture: ComponentFixture<AsignarMesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarMesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
