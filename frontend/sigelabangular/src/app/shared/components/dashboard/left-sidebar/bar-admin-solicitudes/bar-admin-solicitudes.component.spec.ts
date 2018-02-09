import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarAdminSolicitudesComponent } from './bar-admin-solicitudes.component';

describe('BarAdminSolicitudesComponent', () => {
  let component: BarAdminSolicitudesComponent;
  let fixture: ComponentFixture<BarAdminSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarAdminSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarAdminSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
