import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLaboratoriosComponent } from './admin-laboratorios.component';

describe('AdminLaboratoriosComponent', () => {
  let component: AdminLaboratoriosComponent;
  let fixture: ComponentFixture<AdminLaboratoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLaboratoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLaboratoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
