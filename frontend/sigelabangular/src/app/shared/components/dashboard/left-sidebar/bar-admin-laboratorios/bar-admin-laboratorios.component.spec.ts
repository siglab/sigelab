import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarAdminLaboratoriosComponent } from './bar-admin-laboratorios.component';

describe('BarAdminLaboratoriosComponent', () => {
  let component: BarAdminLaboratoriosComponent;
  let fixture: ComponentFixture<BarAdminLaboratoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarAdminLaboratoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarAdminLaboratoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
