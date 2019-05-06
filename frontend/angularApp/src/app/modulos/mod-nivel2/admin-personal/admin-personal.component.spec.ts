import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPersonalComponent } from './admin-personal.component';

describe('AdminPersonalComponent', () => {
  let component: AdminPersonalComponent;
  let fixture: ComponentFixture<AdminPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
