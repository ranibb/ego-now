import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';

import { DriversService } from '../services/drivers.service';
import { DriversDatasource } from '../services/drivers.datasource';
import { Rating } from '../model/interfaces';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MMM DD, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-drivers-table-filters',
  templateUrl: './drivers-table-filters.component.html',
  styleUrls: ['./drivers-table-filters.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DriversTableFiltersComponent implements OnInit {

  dataSource: DriversDatasource;

  driversCount: number;

  public driverStatus: FormControl = new FormControl();

  public ratingMin: FormControl = new FormControl();
  public ratingMax: FormControl = new FormControl();
  rating: Rating = {min: 0, max: 5};

  public dateRange: FormControl = new FormControl();

  constructor(private driversService: DriversService) { }

  ngOnInit() {

    this.dataSource = new DriversDatasource(this.driversService);

    this.driversService.driversCount$.subscribe(driversCount => this.driversCount = driversCount);

    this.driverStatus.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(currentStatus => {
          this.driversService.currentStatus$.next(currentStatus);
          this.loadDriversPage();
        })
      )
      .subscribe();

    this.ratingMin.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(ratingMin => {
          this.rating.min = ratingMin;
          this.driversService.rating$.next(this.rating);
          this.loadDriversPage();
        })
      )
      .subscribe();

    this.ratingMax.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(ratingMax => {
          this.rating.max = ratingMax;
          this.driversService.rating$.next(this.rating);
          this.loadDriversPage();
        })
      )
      .subscribe();

    this.dateRange.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(dateRange => {
          this.driversService.dateRange$.next(dateRange);
          this.loadDriversPage();
        })
      )
      .subscribe();
  }

  loadDriversPage() {
    this.dataSource.searchDrivers();
  }

}
