import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { tap } from 'rxjs/operators';

import { DriversDatasource } from '../services/drivers.datasource';
import { DriversService } from '../services/drivers.service';

@Component({
  selector: 'app-drivers-table-list',
  templateUrl: './drivers-table-list.component.html',
  styleUrls: ['./drivers-table-list.component.css']
})
export class DriversTableListComponent implements OnInit, AfterViewInit {

  dataSource: DriversDatasource;

  driversCount: number;

  displayedColumns = ['id', 'fullName', 'phone', 'createdAt', 'currentStatus', 'lastVehicleDisplay', 'balance', 'ratingsAvg'];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.dataSource = new DriversDatasource(this.driversService);
    this.dataSource.searchDrivers();
    this.driversService.driversCount$.subscribe(driversCount => this.driversCount = driversCount);
  }

  ngAfterViewInit() {
    this.paginator.page
    .pipe(
      tap(() => {
        this.driversService.pageIndex$.next(this.paginator.pageIndex);
        this.driversService.pageSize$.next(this.paginator.pageSize);
        this.dataSource.searchDrivers();
      })
    )
    .subscribe();
  }

}
