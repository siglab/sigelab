import { TestBed, inject } from '@angular/core/testing';

import { ObserverAutenticadoService } from './observer-autenticado.service';

describe('ObserverAutenticadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObserverAutenticadoService]
    });
  });

  it('should be created', inject([ObserverAutenticadoService], (service: ObserverAutenticadoService) => {
    expect(service).toBeTruthy();
  }));
});
