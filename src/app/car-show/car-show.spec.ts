import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarShow } from './car-show';

describe('CarShow', () => {
  let component: CarShow;
  let fixture: ComponentFixture<CarShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarShow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarShow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
