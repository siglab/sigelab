import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosAsociadosComponent } from './servicios-asociados.component';

describe('ServiciosAsociadosComponent', () => {
  let component: ServiciosAsociadosComponent;
  let fixture: ComponentFixture<ServiciosAsociadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosAsociadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
