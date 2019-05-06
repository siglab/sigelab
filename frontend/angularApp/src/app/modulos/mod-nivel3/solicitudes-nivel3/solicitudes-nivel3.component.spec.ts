import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesNivel3Component } from './solicitudes-nivel3.component';

describe('SolicitudesNivel3Component', () => {
  let component: SolicitudesNivel3Component;
  let fixture: ComponentFixture<SolicitudesNivel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesNivel3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesNivel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
