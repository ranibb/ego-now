import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Driver } from '../model/driver';
import { DriversService } from './drivers.service';

export class DriversDatasource implements DataSource<Driver> {

  private driversSubject = new BehaviorSubject<Driver[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private driversService: DriversService) { }

  searchDrivers() {
    this.loadingSubject.next(true);
    this.driversService.searchForDrivers()
    .pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(drivers => {
      this.loadingSubject.next(false);
      this.driversSubject.next(drivers);
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<Driver[]> {
    return this.driversSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.driversSubject.complete();
    this.loadingSubject.complete();
  }
}
