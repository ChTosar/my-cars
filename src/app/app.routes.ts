import { Routes } from '@angular/router';
import { MainPage } from './main-page/main-page';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MainPage },
      { path: ':id', component: MainPage }
    ],
  },
];
