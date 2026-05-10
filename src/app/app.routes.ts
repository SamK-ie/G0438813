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
    path: 'cast-crew-details', 
    loadComponent: () => import('./cast-crew-details/cast-crew-details.page').then(m => m.CastCrewDetailsPage)
  },
  {
    path: 'cast-crew-details/:id',
    loadComponent: () => import('./cast-crew-details/cast-crew-details.page').then((m) => m.CastCrewDetailsPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'full-credits',
    loadComponent: () => import('./full-credits/full-credits.page').then( m => m.FullCreditsPage)
  },
];
