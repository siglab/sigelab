import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiciosComponent } from './admin-servicios.component';

describe('AdminServiciosComponent', () => {
  let component: AdminServiciosComponent;
  let fixture: ComponentFixture<AdminServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
