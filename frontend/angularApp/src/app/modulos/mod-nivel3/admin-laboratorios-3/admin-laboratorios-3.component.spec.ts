import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLaboratorios3Component } from './admin-laboratorios-3.component';

describe('AdminLaboratorios3Component', () => {
  let component: AdminLaboratorios3Component;
  let fixture: ComponentFixture<AdminLaboratorios3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLaboratorios3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLaboratorios3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
