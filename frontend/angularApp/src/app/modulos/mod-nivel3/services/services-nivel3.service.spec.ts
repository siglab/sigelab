import { TestBed, inject } from '@angular/core/testing';

import { ServicesNivel3Service } from './services-nivel3.service';

describe('ServicesNivel3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicesNivel3Service]
    });
  });

  it('should be created', inject([ServicesNivel3Service], (service: ServicesNivel3Service) => {
    expect(service).toBeTruthy();
  }));
});
