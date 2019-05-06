import { TestBed, inject } from '@angular/core/testing';

import { QuerysAutenticadoService } from './querys-autenticado.service';

describe('QuerysAutenticadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuerysAutenticadoService]
    });
  });

  it('should be created', inject([QuerysAutenticadoService], (service: QuerysAutenticadoService) => {
    expect(service).toBeTruthy();
  }));
});
