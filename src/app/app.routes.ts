import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./favourites/favourites.page').then((m) => m.FavouritesPage),
  },
  {
    path: 'movie-details/:id',
    loadComponent: () => import('./movie-details/movie-details.page').then((m) => m.MovieDetailsPage),
  },
  {
    path: 'movie-credits/:id',
    loadComponent: () => import('./movie-credits/movie-credits.page').then((m) => m.MovieCreditsPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
