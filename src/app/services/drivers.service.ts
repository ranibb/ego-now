import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { convertSnaps } from './db-utils';
import { Driver } from '../model/driver';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  constructor(private db: AngularFirestore) { }

  findAllDrivers(): Observable<Driver[]> {
    return this.db.collection('drivers')
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Driver>(snaps)),
        first()
      );
  }
}

