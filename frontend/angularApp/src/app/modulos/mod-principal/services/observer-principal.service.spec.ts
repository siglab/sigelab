import { TestBed, inject } from '@angular/core/testing';

import { ObserverPrincipalService } from './observer-principal.service';

describe('ObserverPrincipalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObserverPrincipalService]
    });
  });

  it('should be created', inject([ObserverPrincipalService], (service: ObserverPrincipalService) => {
    expect(service).toBeTruthy();
  }));
});
