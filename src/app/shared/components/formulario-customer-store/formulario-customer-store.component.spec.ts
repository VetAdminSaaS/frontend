import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCustomerStoreComponent } from './formulario-customer-store.component';

describe('FormularioCustomerStoreComponent', () => {
  let component: FormularioCustomerStoreComponent;
  let fixture: ComponentFixture<FormularioCustomerStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioCustomerStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioCustomerStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
