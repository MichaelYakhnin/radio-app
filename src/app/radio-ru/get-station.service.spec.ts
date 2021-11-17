import { TestBed } from '@angular/core/testing';

import { GetStationService } from './get-station.service';

describe('GetStationService', () => {
  let service: GetStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
