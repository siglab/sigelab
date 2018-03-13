import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresGraficasReportesComponent } from './indicadores-graficas-reportes.component';

describe('IndicadoresGraficasReportesComponent', () => {
  let component: IndicadoresGraficasReportesComponent;
  let fixture: ComponentFixture<IndicadoresGraficasReportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresGraficasReportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresGraficasReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
