import { Component, OnInit } from '@angular/core';
import {finalize, tap} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { DriversService } from '../services/drivers.service';
import { Driver } from '../model/driver';

@Component({
  selector: 'app-drivers-table-list',
  templateUrl: './drivers-table-list.component.html',
  styleUrls: ['./drivers-table-list.component.css']
})
export class DriversTableListComponent implements OnInit {

  dataSource: MatTableDataSource<Driver>;

  loading = false;

  displayedColumns = ['id', 'fullName', 'phone', 'createdAt', 'currentStatus', 'lastVehicleDisplay', 'balance', 'ratingsAvg'];

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.loading = true;
    this.dataSource = new MatTableDataSource([]);
    this.driversService.findAllDrivers()
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(drivers => this.dataSource.data = drivers);
  }

}
