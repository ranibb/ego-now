import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DriversTableListComponent } from './drivers-table-list/drivers-table-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent

  },
  {
    path: 'drivers-table-list',
    component: DriversTableListComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
