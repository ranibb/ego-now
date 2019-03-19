import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { DriversService } from '../services/drivers.service';

@Component({
  selector: 'app-drivers-table-filters',
  templateUrl: './drivers-table-filters.component.html',
  styleUrls: ['./drivers-table-filters.component.css']
})
export class DriversTableFiltersComponent implements OnInit {

  public driverStatus: FormControl = new FormControl();
  driverStatusLocal: string;

  public ratingsAvgMin: FormControl = new FormControl();
  ratingsAvgMinLocal: number;

  public ratingsAvgMax: FormControl = new FormControl();
  ratingsAvgMaxLocal: number;

  numberOfDriversLocal: number;

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.driversService.currentStatus$.next('');
    this.driversService.ratingsAvgMin$.next(0);
    this.driversService.ratingsAvgMax$.next(5);
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
  }

  loadDriversPage() {
    this.driversService.searchForDrivers();
  }

}
