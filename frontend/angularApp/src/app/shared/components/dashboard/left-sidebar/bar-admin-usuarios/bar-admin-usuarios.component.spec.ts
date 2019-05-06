import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarAdminUsuariosComponent } from './bar-admin-usuarios.component';

describe('BarAdminUsuariosComponent', () => {
  let component: BarAdminUsuariosComponent;
  let fixture: ComponentFixture<BarAdminUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarAdminUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarAdminUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
