import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, combineLatest, of, BehaviorSubject } from 'rxjs';
import { map, first, switchMap, tap } from 'rxjs/operators';

import { convertSnaps } from './db-utils';
import { Driver } from '../model/driver';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  currentStatus$ = new Subject<string>();

  ratingsAvgMin$ = new Subject<number>();
  ratingsAvgMin: any;

  ratingsAvgMax$ = new Subject<number>();
  ratingsAvgMax: any;

  numberOfDrivers$ = new Subject<number>();

  pageIndex$ = new BehaviorSubject<number>(0);
  pageSize$ = new BehaviorSubject<number>(10);

  dateRange$ = new Subject<any>();
  dateRangeBegine: any;
  dateRangeEnd: any;

  constructor(private db: AngularFirestore) { }

  // Query on the server-side and then on the client side due to limitation.
  searchForDrivers(): Observable<Driver[]> {
    this.ratingsAvgMin$.subscribe(ratingsAvgMin => this.ratingsAvgMin = ratingsAvgMin);
    this.ratingsAvgMax$.subscribe(ratingsAvgMax => this.ratingsAvgMax = ratingsAvgMax);
    this.dateRange$.subscribe(dateRange => {
      this.dateRangeBegine = new Date(dateRange.begin).toISOString();
      this.dateRangeEnd = new Date(dateRange.end).toISOString();
    });

    return combineLatest(this.currentStatus$, this.ratingsAvgMin$, this.ratingsAvgMax$, this.pageIndex$, this.pageSize$, this.dateRange$)
      .pipe(
        switchMap(([currentStatus, ratingsAvgMin, ratingsAvgMax, pageIndex, pageSize, dateRange]) =>
          this.db.collection('drivers', ref =>
          // ref.where('currentStatus', '==', currentStatus).where('ratingsAvgMin', '>=', ratingsAvgMin) // another way to qoery the db
          // tslint:disable-next-line: one-line
          {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (currentStatus) { query = query.where('currentStatus', '==', currentStatus); }
            /** combine multiple queries? didn't work .. perhaps in future ..
             * if (ratingsAvgMin) {
             *    query = query.where('ratingsAvg', '>=', ratingsAvgMin).where('ratingsAvg', '<=', ratingsAvgMax);
             * }
             */
            return query;
          }
          ).snapshotChanges()
        ),
        map(snaps => convertSnaps<Driver>(snaps)),
        map(drivers => drivers.filter(driver => driver.ratingsAvg >= this.ratingsAvgMin && driver.ratingsAvg <= this.ratingsAvgMax)),
        map(drivers => drivers.filter(driver => driver.createdAt >= this.dateRangeBegine && driver.createdAt <= this.dateRangeEnd)),
        tap(drivers => this.numberOfDrivers$.next(drivers.length))
      );
  }
}

