import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFactusComponent } from './sidebar-factus.component';

describe('SidebarFactusComponent', () => {
  let component: SidebarFactusComponent;
  let fixture: ComponentFixture<SidebarFactusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFactusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarFactusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
