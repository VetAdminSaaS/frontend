import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaSuspendidaInformationComponent } from './cuenta-suspendida-information.component';

describe('CuentaSuspendidaInformationComponent', () => {
  let component: CuentaSuspendidaInformationComponent;
  let fixture: ComponentFixture<CuentaSuspendidaInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaSuspendidaInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaSuspendidaInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
