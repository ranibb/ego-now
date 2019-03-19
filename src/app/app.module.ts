import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatDividerModule,
  MatSelectModule,
  MatInputModule
} from '@angular/material';
import { HomeComponent } from './home/home.component';
import { DriversTableListComponent } from './drivers-table-list/drivers-table-list.component';
import { DriverComponent } from './driver/driver.component';
import { DriversService } from './services/drivers.service';
import { DriversTableFiltersComponent } from './drivers-table-filters/drivers-table-filters.component';

@NgModule({
  declarations: [
    AppComponent,
    DriversTableListComponent,
    DriverComponent,
    HomeComponent,
    DriversTableFiltersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDividerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [
    DriversService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
