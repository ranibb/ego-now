import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { DriversService } from '../services/drivers.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';

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

  public driverStatus: FormControl = new FormControl();
  driverStatusLocal: string;

  public ratingsAvgMin: FormControl = new FormControl();
  ratingsAvgMinLocal: number;

  public ratingsAvgMax: FormControl = new FormControl();
  ratingsAvgMaxLocal: number;

  numberOfDriversLocal: number;

  public dateRange: FormControl = new FormControl();
  dateRangeLocal = {
    begin: new Date(2017, 7, 5),
    end: new Date(2020, 7, 25)
  };

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.driversService.currentStatus$.next('');
    this.driversService.ratingsAvgMin$.next(0);
    this.driversService.ratingsAvgMax$.next(5);
    this.driversService.dateRange$.next(this.dateRangeLocal);
    this.driversService.numberOfDrivers$.subscribe(numberOfDrivers => this.numberOfDriversLocal = numberOfDrivers);

    this.driverStatus.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(currentStatus => {
          this.driverStatusLocal = currentStatus;
          this.driversService.currentStatus$.next(this.driverStatusLocal);
          this.loadDriversPage();
        })
      )
      .subscribe();

    this.ratingsAvgMin.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(ratingsAvgMin => {
          this.ratingsAvgMinLocal = ratingsAvgMin;
          this.driversService.ratingsAvgMin$.next(this.ratingsAvgMinLocal);
          this.loadDriversPage();
        })
      )
      .subscribe();

    this.ratingsAvgMax.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(ratingsAvgMax => {
          this.ratingsAvgMaxLocal = ratingsAvgMax;
          this.driversService.ratingsAvgMax$.next(this.ratingsAvgMaxLocal);
          this.loadDriversPage();
        })
      )
      .subscribe();

    this.dateRange.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(dateRange => {
          this.dateRangeLocal = dateRange;
          this.driversService.dateRange$.next(this.dateRangeLocal);
          this.loadDriversPage();
        })
      )
      .subscribe();
  }

  loadDriversPage() {
    this.driversService.searchForDrivers();
  }

}
