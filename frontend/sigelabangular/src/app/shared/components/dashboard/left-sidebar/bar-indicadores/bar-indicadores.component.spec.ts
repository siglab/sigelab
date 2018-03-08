import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarIndicadoresComponent } from './bar-indicadores.component';

describe('BarIndicadoresComponent', () => {
  let component: BarIndicadoresComponent;
  let fixture: ComponentFixture<BarIndicadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarIndicadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
