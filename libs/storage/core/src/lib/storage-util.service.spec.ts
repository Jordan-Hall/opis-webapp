import { TestBed } from '@angular/core/testing';

import { StorageUtilService } from './storage-util.service';

describe('StorageUtilService', () => {
  let service: StorageUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
