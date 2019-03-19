import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversTableFiltersComponent } from './drivers-table-filters.component';

describe('DriversTableFiltersComponent', () => {
  let component: DriversTableFiltersComponent;
  let fixture: ComponentFixture<DriversTableFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversTableFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversTableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
