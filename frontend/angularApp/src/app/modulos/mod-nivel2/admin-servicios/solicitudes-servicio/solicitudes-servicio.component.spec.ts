import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesServicioComponent } from './solicitudes-servicio.component';

describe('SolicitudesServicioComponent', () => {
  let component: SolicitudesServicioComponent;
  let fixture: ComponentFixture<SolicitudesServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
