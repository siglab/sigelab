import { TestBed, async, inject } from '@angular/core/testing';

import { PrincipalGuard } from './principal.guard';

describe('PrincipalGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrincipalGuard]
    });
  });

  it('should ...', inject([PrincipalGuard], (guard: PrincipalGuard) => {
    expect(guard).toBeTruthy();
  }));
});
