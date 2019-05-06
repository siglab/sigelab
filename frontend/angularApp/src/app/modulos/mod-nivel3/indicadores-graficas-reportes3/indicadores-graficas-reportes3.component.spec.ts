import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresGraficasReportes3Component } from './indicadores-graficas-reportes3.component';

describe('IndicadoresGraficasReportes3Component', () => {
  let component: IndicadoresGraficasReportes3Component;
  let fixture: ComponentFixture<IndicadoresGraficasReportes3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresGraficasReportes3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresGraficasReportes3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
