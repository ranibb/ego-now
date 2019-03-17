import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversTableListComponent } from './drivers-table-list.component';

describe('DriversTableListComponent', () => {
  let component: DriversTableListComponent;
  let fixture: ComponentFixture<DriversTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversTableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
