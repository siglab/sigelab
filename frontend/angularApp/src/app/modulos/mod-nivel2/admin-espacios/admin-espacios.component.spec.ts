import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEspaciosComponent } from './admin-espacios.component';

describe('AdminEspaciosComponent', () => {
  let component: AdminEspaciosComponent;
  let fixture: ComponentFixture<AdminEspaciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEspaciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
