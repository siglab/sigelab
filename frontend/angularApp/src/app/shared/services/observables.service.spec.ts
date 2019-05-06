import { TestBed, inject } from '@angular/core/testing';

import { ObservablesService } from './observables.service';

describe('ObservablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObservablesService]
    });
  });

  it('should be created', inject([ObservablesService], (service: ObservablesService) => {
    expect(service).toBeTruthy();
  }));
});
