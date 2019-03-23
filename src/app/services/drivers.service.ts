import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import moment = require('moment');

import { convertSnaps } from './db-utils';
import { Driver } from '../model/driver';
import { DateRange, Rating } from '../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  currentStatus$ = new BehaviorSubject<string>('');

  rating$ = new BehaviorSubject<Rating>({min: 0, max: 5});
  rating: Rating = {min: 0, max: 5};

  dateRange$ = new BehaviorSubject<DateRange>({begin: moment(2016).toISOString(), end: moment().toISOString()});
  dateRange: DateRange = {begin: '', end: ''};

  driversCount$ = new BehaviorSubject<number>(10);

  pageIndex$ = new BehaviorSubject<number>(0);

  pageSize$ = new BehaviorSubject<number>(10);

  constructor(private db: AngularFirestore) { }

  // Query on the server-side and then on the client side due to limitation.
  searchForDrivers(): Observable<Driver[]> {
    this.rating$.subscribe(rating => {
      this.rating.min = rating.min;
      this.rating.max = rating.max;
    });
    this.dateRange$.subscribe(dateRange => {
      this.dateRange.begin = moment(dateRange.begin).toISOString();
      this.dateRange.end = moment(dateRange.end).toISOString();
    });

    return combineLatest(this.currentStatus$, this.rating$, this.dateRange$)
      .pipe(
        switchMap(([currentStatus, ratings, dateRange]) =>
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
        map(drivers => drivers.filter(driver => driver.ratingsAvg >= this.rating.min && driver.ratingsAvg <= this.rating.max)),
        map(drivers => drivers.filter(driver => driver.createdAt >= this.dateRange.begin && driver.createdAt <= this.dateRange.end)),
        tap(drivers => this.driversCount$.next(drivers.length))
      );
  }
}

