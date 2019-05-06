import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarBusquedaComponent } from './bar-busqueda.component';

describe('BarBusquedaComponent', () => {
  let component: BarBusquedaComponent;
  let fixture: ComponentFixture<BarBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
