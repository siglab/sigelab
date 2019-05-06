import { TestBed, async, inject } from '@angular/core/testing';

import { Nivel2Guard } from './nivel2.guard';

describe('Nivel2Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Nivel2Guard]
    });
  });

  it('should ...', inject([Nivel2Guard], (guard: Nivel2Guard) => {
    expect(guard).toBeTruthy();
  }));
});
