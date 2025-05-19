import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasEmpleadoComponent } from './asistencias-empleado.component';

describe('AsistenciasEmpleadoComponent', () => {
  let component: AsistenciasEmpleadoComponent;
  let fixture: ComponentFixture<AsistenciasEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciasEmpleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciasEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
