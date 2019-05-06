import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarComunicacionMasivaComponent } from './bar-comunicacion-masiva.component';

describe('BarComunicacionMasivaComponent', () => {
  let component: BarComunicacionMasivaComponent;
  let fixture: ComponentFixture<BarComunicacionMasivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarComunicacionMasivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarComunicacionMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
