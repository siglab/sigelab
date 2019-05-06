import { TestBed, inject } from '@angular/core/testing';

import { Modulo2Service } from './modulo2.service';

describe('Modulo2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Modulo2Service]
    });
  });

  it('should be created', inject([Modulo2Service], (service: Modulo2Service) => {
    expect(service).toBeTruthy();
  }));
});
