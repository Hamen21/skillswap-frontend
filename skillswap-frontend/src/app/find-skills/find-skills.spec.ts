import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSkills } from './find-skills';

describe('FindSkills', () => {
  let component: FindSkills;
  let fixture: ComponentFixture<FindSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSkills],
    }).compileComponents();

    fixture = TestBed.createComponent(FindSkills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
