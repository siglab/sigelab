import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusPruComponent } from './bus-pru.component';

describe('BusPruComponent', () => {
  let component: BusPruComponent;
  let fixture: ComponentFixture<BusPruComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusPruComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusPruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
