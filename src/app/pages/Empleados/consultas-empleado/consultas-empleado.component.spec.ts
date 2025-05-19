import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasEmpleadoComponent } from './consultas-empleado.component';

describe('ConsultasEmpleadoComponent', () => {
  let component: ConsultasEmpleadoComponent;
  let fixture: ComponentFixture<ConsultasEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasEmpleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultasEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
