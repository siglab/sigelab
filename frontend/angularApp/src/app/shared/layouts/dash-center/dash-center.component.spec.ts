import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCenterComponent } from './dash-center.component';

describe('DashCenterComponent', () => {
  let component: DashCenterComponent;
  let fixture: ComponentFixture<DashCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
