import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProyectosComponent } from './admin-proyectos.component';

describe('AdminProyectosComponent', () => {
  let component: AdminProyectosComponent;
  let fixture: ComponentFixture<AdminProyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
