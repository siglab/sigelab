import { TestBed, inject } from '@angular/core/testing';

import { QuerysPrincipalService } from './querys-principal.service';

describe('QuerysPrincipalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuerysPrincipalService]
    });
  });

  it('should be created', inject([QuerysPrincipalService], (service: QuerysPrincipalService) => {
    expect(service).toBeTruthy();
  }));
});
