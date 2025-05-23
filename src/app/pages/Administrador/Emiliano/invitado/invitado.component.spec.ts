import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitadoComponent } from './invitado.component';

describe('InvitadoComponent', () => {
  let component: InvitadoComponent;
  let fixture: ComponentFixture<InvitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
