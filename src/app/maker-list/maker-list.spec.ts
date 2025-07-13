import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerList } from './maker-list';

describe('MakerList', () => {
  let component: MakerList;
  let fixture: ComponentFixture<MakerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakerList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
