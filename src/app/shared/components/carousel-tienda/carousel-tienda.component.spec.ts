import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselTiendaComponent } from './carousel-tienda.component';

describe('CarouselTiendaComponent', () => {
  let component: CarouselTiendaComponent;
  let fixture: ComponentFixture<CarouselTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselTiendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
