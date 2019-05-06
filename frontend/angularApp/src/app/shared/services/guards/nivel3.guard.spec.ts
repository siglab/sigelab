import { TestBed, async, inject } from '@angular/core/testing';

import { Nivel3Guard } from './nivel3.guard';

describe('Nivel3Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Nivel3Guard]
    });
  });

  it('should ...', inject([Nivel3Guard], (guard: Nivel3Guard) => {
    expect(guard).toBeTruthy();
  }));
});
