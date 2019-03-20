import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DriversService } from '../services/drivers.service';
import { DriversDatasource } from '../services/drivers.datasource';
import { MatPaginator } from '@angular/material';
import { startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-drivers-table-list',
  templateUrl: './drivers-table-list.component.html',
  styleUrls: ['./drivers-table-list.component.css']
})
export class DriversTableListComponent implements OnInit, AfterViewInit {

  dataSource: DriversDatasource;

  numberOfDriversLocal: number;

  loading = false;

  displayedColumns = ['id', 'fullName', 'phone', 'createdAt', 'currentStatus', 'lastVehicleDisplay', 'balance', 'ratingsAvg'];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.loading = true;
    this.dataSource = new DriversDatasource(this.driversService);
    this.dataSource.searchDrivers();
    this.driversService.numberOfDrivers$.subscribe(numberOfDrivers => this.numberOfDriversLocal = numberOfDrivers);
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
