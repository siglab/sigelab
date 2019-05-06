import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarAdminLaboratorioSuperiorComponent } from './bar-admin-laboratorio-superior.component';

describe('BarAdminLaboratorioSuperiorComponent', () => {
  let component: BarAdminLaboratorioSuperiorComponent;
  let fixture: ComponentFixture<BarAdminLaboratorioSuperiorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarAdminLaboratorioSuperiorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarAdminLaboratorioSuperiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
