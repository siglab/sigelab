import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusServComponent } from './bus-serv.component';

describe('BusServComponent', () => {
  let component: BusServComponent;
  let fixture: ComponentFixture<BusServComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusServComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusServComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
