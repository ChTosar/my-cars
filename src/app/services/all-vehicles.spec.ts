import { TestBed } from '@angular/core/testing';

import { AllVehicles } from './all-vehicles';

describe('AllVehicles', () => {
  let service: AllVehicles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllVehicles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
