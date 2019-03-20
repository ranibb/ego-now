import { Component, OnInit } from '@angular/core';
import { DriversService } from '../services/drivers.service';
import { DriversDatasource } from '../services/drivers.datasource';

@Component({
  selector: 'app-drivers-table-list',
  templateUrl: './drivers-table-list.component.html',
  styleUrls: ['./drivers-table-list.component.css']
})
export class DriversTableListComponent implements OnInit {

  dataSource: DriversDatasource;

  loading = false;

  displayedColumns = ['id', 'fullName', 'phone', 'createdAt', 'currentStatus', 'lastVehicleDisplay', 'balance', 'ratingsAvg'];

  constructor(private driversService: DriversService) { }

  ngOnInit() {
    this.loading = true;
    this.dataSource = new DriversDatasource(this.driversService);
    this.dataSource.searchDrivers();
  }

}
