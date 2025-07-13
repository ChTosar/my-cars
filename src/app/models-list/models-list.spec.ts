import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsList } from './models-list';

describe('ModelsList', () => {
  let component: ModelsList;
  let fixture: ComponentFixture<ModelsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
