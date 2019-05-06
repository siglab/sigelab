import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BardAdminQrComponent } from './bard-admin-qr.component';

describe('BardAdminQrComponent', () => {
  let component: BardAdminQrComponent;
  let fixture: ComponentFixture<BardAdminQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BardAdminQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BardAdminQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
