import { TestBed } from '@angular/core/testing';

import { UtilityFormService } from './utility-form.service';

describe('UtilityFormService', () => {
  let service: UtilityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
