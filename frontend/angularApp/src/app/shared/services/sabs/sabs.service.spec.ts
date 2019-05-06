import { TestBed, inject } from '@angular/core/testing';

import { SabsService } from './sabs.service';

describe('SabsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SabsService]
    });
  });

  it('should be created', inject([SabsService], (service: SabsService) => {
    expect(service).toBeTruthy();
  }));
});
