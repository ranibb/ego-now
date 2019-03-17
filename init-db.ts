
import {driversObject} from './db-data';

import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBswXzrdCFz6O2uVMvnIKTU2_sIamel2Hw',
  authDomain: 'ego-now.firebaseapp.com',
  databaseURL: 'https://ego-now.firebaseio.com',
  projectId: 'ego-now',
  storageBucket: 'ego-now.appspot.com',
  messagingSenderId: '423336525418'
};

console.log('Uploading data to the database with the following config:\n');

console.log(JSON.stringify(config));

console.log('Make sure that this is your own database, so that you have write access to it.\n');

firebase.initializeApp(config);

const db = firebase.firestore();

async function uploadData() {
  const batch = db.batch();
  const drivers = db.collection('drivers');
  Object.values(driversObject)
    .forEach(async (driver: any) => {
      const newDriver = driver;
      const driverRef = await drivers.add(newDriver);
    });
  return batch.commit();
}

function removeId(data: any) {
  const newData: any = {...data};
  delete newData.id;
  return newData;
}

uploadData()
  .then(() => {
    console.log('Writing data, exiting in 10 seconds ...\n');
    setTimeout(() => {
      console.log('\n\n\nData Upload Completed.\n');
      process.exit(0);
    }, 10000);
  })
  .catch(err => {
    console.log('Data upload failed, reason:', err, '\n');
    process.exit(-1);
  });
