import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarSolicitudesNivel3Component } from './bar-solicitudes-nivel3.component';

describe('BarSolicitudesNivel3Component', () => {
  let component: BarSolicitudesNivel3Component;
  let fixture: ComponentFixture<BarSolicitudesNivel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarSolicitudesNivel3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarSolicitudesNivel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
