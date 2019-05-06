import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionMasivaComponent } from './comunicacion-masiva.component';

describe('ComunicacionMasivaComponent', () => {
  let component: ComunicacionMasivaComponent;
  let fixture: ComponentFixture<ComunicacionMasivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComunicacionMasivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicacionMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
