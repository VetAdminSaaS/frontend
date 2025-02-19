import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorevetComponent } from './storevet.component';

describe('StorevetComponent', () => {
  let component: StorevetComponent;
  let fixture: ComponentFixture<StorevetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorevetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorevetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
