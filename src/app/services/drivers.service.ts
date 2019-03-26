import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, BehaviorSubject, Subject } from 'rxjs';
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
  currentStatus: string;

  rating$ = new BehaviorSubject<Rating>({ min: 0, max: 5 });
  rating: Rating = { min: 0, max: 5 };

  dateRange$ = new BehaviorSubject<DateRange>({ begin: moment(2016).toISOString(), end: moment().toISOString() });
  dateRange: DateRange = { begin: '', end: '' };

  driversCount$ = new Subject<number>();
  driversCount: number;

  pageIndex$ = new BehaviorSubject<number>(0);

  pageSize$ = new BehaviorSubject<number>(10);

  latestDriver: string;

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
    this.currentStatus$.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
    });

    return combineLatest(this.currentStatus$, this.rating$, this.dateRange$, this.pageIndex$, this.pageSize$)
      .pipe(
        switchMap(([currentStatus, ratings, dateRange, pageIndex, pageSize]) =>
          this.db.collection('drivers', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query.get().then(values => this.driversCount$.next(values.docs.length));
            query = query.orderBy('createdAt', 'desc');
            if (!this.latestDriver) {
              query = query.limit(pageSize);
            }
            if (this.latestDriver && (currentStatus || ratings || dateRange) && (pageIndex)) {
              query = query.startAfter(this.latestDriver);
              query = query.limit(pageSize);
            }
            if (currentStatus) {
              query = query.where('currentStatus', '==', currentStatus);
              query = query.limit(pageSize);
            }
            if (!currentStatus) {
              query = query.limit(pageSize);
            }
            return query;
          }).snapshotChanges()
        ),
        map(snaps => convertSnaps<Driver>(snaps)),
        map(drivers => drivers.filter(driver => driver.ratingsAvg >= this.rating.min && driver.ratingsAvg <= this.rating.max)),
        map(drivers => drivers.filter(driver => driver.createdAt >= this.dateRange.begin && driver.createdAt <= this.dateRange.end)),
        tap(drivers => {
          this.latestDriver = drivers[drivers.length - 1].createdAt;
        })

      );
  }
}

