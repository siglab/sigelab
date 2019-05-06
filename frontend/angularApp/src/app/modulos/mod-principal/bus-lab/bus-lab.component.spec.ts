import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusLabComponent } from './bus-lab.component';

describe('BusLabComponent', () => {
  let component: BusLabComponent;
  let fixture: ComponentFixture<BusLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
