import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQrComponent } from './form-qr.component';

describe('FormQrComponent', () => {
  let component: FormQrComponent;
  let fixture: ComponentFixture<FormQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
