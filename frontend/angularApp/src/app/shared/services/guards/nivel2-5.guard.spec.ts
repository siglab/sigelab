import { TestBed, async, inject } from '@angular/core/testing';

import { Nivel25Guard } from './nivel2-5.guard';

describe('Nivel25Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Nivel25Guard]
    });
  });

  it('should ...', inject([Nivel25Guard], (guard: Nivel25Guard) => {
    expect(guard).toBeTruthy();
  }));
});
