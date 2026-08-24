import { TestBed } from '@angular/core/testing';

import { SkillSwapService } from './skill-swap';

describe('SkillSwapService', () => {

  let service: SkillSwapService;

  beforeEach(() => {

    TestBed.configureTestingModule({});

    service = TestBed.inject(SkillSwapService);

  });

  it('should be created', () => {

    expect(service).toBeTruthy();

  });

});