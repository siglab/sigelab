import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQrComponent } from './admin-qr.component';

describe('AdminQrComponent', () => {
  let component: AdminQrComponent;
  let fixture: ComponentFixture<AdminQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
