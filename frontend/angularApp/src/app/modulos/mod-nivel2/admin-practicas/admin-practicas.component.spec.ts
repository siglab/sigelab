import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPracticasComponent } from './admin-practicas.component';

describe('AdminPracticasComponent', () => {
  let component: AdminPracticasComponent;
  let fixture: ComponentFixture<AdminPracticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPracticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPracticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
