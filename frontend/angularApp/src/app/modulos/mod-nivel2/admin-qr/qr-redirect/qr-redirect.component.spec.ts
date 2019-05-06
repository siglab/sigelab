import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrRedirectComponent } from './qr-redirect.component';

describe('QrRedirectComponent', () => {
  let component: QrRedirectComponent;
  let fixture: ComponentFixture<QrRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
