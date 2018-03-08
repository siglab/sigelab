import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLaboratorios25Component } from './admin-laboratorios-2-5.component';

describe('AdminLaboratorios25Component', () => {
  let component: AdminLaboratorios25Component;
  let fixture: ComponentFixture<AdminLaboratorios25Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLaboratorios25Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLaboratorios25Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
