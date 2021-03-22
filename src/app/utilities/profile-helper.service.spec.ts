import { TestBed } from '@angular/core/testing';

import { ProfileHelperService } from './profile-helper.service';

describe('ProfileHelperService', () => {
  let service: ProfileHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
