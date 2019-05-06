import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudBajaComponent } from './solicitud-baja.component';

describe('SolicitudBajaComponent', () => {
  let component: SolicitudBajaComponent;
  let fixture: ComponentFixture<SolicitudBajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudBajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudBajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
